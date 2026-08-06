/* Interactive WebGL globe — ported from the original <globe-3d> custom element
   to a framework-agnostic class driven by the React wrapper in components/Globe.tsx.

   createGlobe(container, {
     markers: [{ id, name, lat, lon }],
     selected: id | null,
     autoRotate: boolean,
     speed: number,
     onSelect(id), onClear()
   }) -> { setMarkers, setSelected, setAutoRotate, setSpeed, destroy }
*/
import * as THREE from 'three';
import { mesh as topoMesh } from 'topojson-client';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const LAND_URL = '/land-110m.json';

class Globe {
  constructor(container, opts = {}) {
    this.el = container;
    this._markers = opts.markers || [];
    this._sel = opts.selected || null;
    this._auto = opts.autoRotate !== false;
    this._speed = opts.speed || 1;
    this._onSelect = opts.onSelect || (() => {});
    this._onClear = opts.onClear || (() => {});

    this._ready = false;
    this._dead = false;
    this._raf = 0;
    this._tween = null;
    this._hover = null;
    this._hoverObj = null;
    this._drag = null;
    this._vel = { x: 0, y: 0 };
    this._targetZ = 2.6;
    this._disposables = [];

    this._mount();
    this._init();
  }

  /* ---------------------------------------------------------------- public */

  setMarkers(markers) {
    this._markers = markers || [];
    if (this._ready) this._buildMarkers();
  }

  setSelected(id) {
    const next = id || null;
    if (next === this._sel) return;
    this._sel = next;
    if (!this._ready) return;
    if (next) this._focus(next);
    else this._targetZ = 2.6;
  }

  setAutoRotate(on) {
    this._auto = on !== false;
  }

  setSpeed(speed) {
    this._speed = parseFloat(speed) || 1;
  }

  destroy() {
    this._dead = true;
    cancelAnimationFrame(this._raf);
    if (this._ro) this._ro.disconnect();
    for (const d of this._disposables) {
      try {
        d.dispose();
      } catch {
        /* noop */
      }
    }
    if (this._renderer) {
      this._renderer.dispose();
      this._renderer.forceContextLoss?.();
      this._renderer.domElement.remove();
    }
    if (this._fallbackEl) this._fallbackEl.remove();
    if (this._label) this._label.remove();
    this._disposables = [];
  }

  /* ----------------------------------------------------------------- setup */

  _mount() {
    const el = this.el;
    el.style.display = 'block';
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.style.overflow = 'hidden';

    const label = (this._label = document.createElement('div'));
    Object.assign(label.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      padding: '7px 12px',
      pointerEvents: 'none',
      border: '1px solid rgba(216,181,120,.45)',
      background: 'rgba(8,11,20,.85)',
      color: '#ecd9ac',
      fontSize: '11px',
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      backdropFilter: 'blur(8px)',
      opacity: '0',
      transition: 'opacity .2s',
      whiteSpace: 'nowrap',
      zIndex: '3',
    });
    el.appendChild(label);
  }

  _init() {
    if (this._dead) return;
    const el = this.el;
    const w = el.clientWidth || 800;
    const h = el.clientHeight || 600;

    let renderer;
    try {
      renderer = this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      // No WebGL (disabled GPU, headless, very old browser) — keep the page usable.
      console.warn('WebGL unavailable, falling back to static backdrop', e);
      this._fallback();
      return;
    }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(w, h, false);
    Object.assign(renderer.domElement.style, {
      width: '100%',
      height: '100%',
      display: 'block',
      opacity: '0',
      transition: 'opacity 1.4s ease',
      cursor: 'grab',
      touchAction: 'none',
    });
    el.insertBefore(renderer.domElement, this._label);

    const scene = (this._scene = new THREE.Scene());
    const cam = (this._cam = new THREE.PerspectiveCamera(38, w / h, 0.1, 100));
    cam.position.set(0, 0, 2.6);

    const world = (this._world = new THREE.Group());
    scene.add(world);

    // base sphere
    const sphereGeo = new THREE.SphereGeometry(0.992, 64, 64);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0x070c16, transparent: true, opacity: 0.94 });
    world.add(new THREE.Mesh(sphereGeo, sphereMat));
    this._disposables.push(sphereGeo, sphereMat);

    // graticule
    const gPts = [];
    for (let lat = -75; lat <= 75; lat += 15) {
      let prev = null;
      for (let i = 0; i <= 128; i++) {
        const p = this._ll(lat, (i / 128) * 360 - 180, 0.999);
        if (prev) gPts.push(prev.x, prev.y, prev.z, p.x, p.y, p.z);
        prev = p;
      }
    }
    for (let lon = -180; lon < 180; lon += 15) {
      let prev = null;
      for (let i = 0; i <= 64; i++) {
        const p = this._ll((i / 64) * 180 - 90, lon, 0.999);
        if (prev) gPts.push(prev.x, prev.y, prev.z, p.x, p.y, p.z);
        prev = p;
      }
    }
    const gGeo = new THREE.BufferGeometry();
    gGeo.setAttribute('position', new THREE.Float32BufferAttribute(gPts, 3));
    const gMat = new THREE.LineBasicMaterial({ color: 0x27324c, transparent: true, opacity: 0.35 });
    world.add(new THREE.LineSegments(gGeo, gMat));
    this._disposables.push(gGeo, gMat);

    // atmosphere
    const atmGeo = new THREE.SphereGeometry(1.16, 48, 48);
    const atmMat = new THREE.ShaderMaterial({
      vertexShader:
        'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader:
        'varying vec3 vN; void main(){ float i = pow(max(0.0, 0.68 + dot(vN, vec3(0.,0.,1.))), 3.0) * 0.42; gl_FragColor = vec4(0.30, 0.44, 0.95, 1.0) * i; }',
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    scene.add(new THREE.Mesh(atmGeo, atmMat));
    this._disposables.push(atmGeo, atmMat);

    // stars
    this._glowTex = this._makeGlowTex();
    this._disposables.push(this._glowTex);
    scene.add(this._stars(700, 0x9fb4dd, 0.055, 0.75));
    scene.add(this._stars(180, 0xd8b578, 0.05, 0.5));

    // initial orientation (Europe / Istanbul in view)
    const v0 = this._ll(38, 26, 1);
    const L0 = Math.hypot(v0.x, v0.z);
    world.rotation.y = Math.atan2(-v0.x, v0.z);
    world.rotation.x = Math.atan2(v0.y, L0) * 0.85;

    this._ray = new THREE.Raycaster();
    this._buildMarkers();
    this._loadLand();
    this._bindInput(renderer.domElement);

    this._ro = new ResizeObserver(() => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      if (!W || !H) return;
      renderer.setSize(W, H, false);
      cam.aspect = W / H;
      cam.updateProjectionMatrix();
    });
    this._ro.observe(el);

    this._ready = true;
    if (this._sel) this._focus(this._sel);

    let last = performance.now();
    const loop = (now) => {
      if (this._dead) return;
      this._raf = requestAnimationFrame(loop);
      const dt = Math.min(3, (now - last) / 16.7);
      last = now;
      this._tick(now, dt);
      renderer.render(scene, cam);
    };
    this._raf = requestAnimationFrame(loop);
    requestAnimationFrame(() => {
      if (!this._dead) renderer.domElement.style.opacity = '1';
    });
  }

  /** Static stand-in for the globe when WebGL cannot be initialised. */
  _fallback() {
    const disc = document.createElement('div');
    Object.assign(disc.style, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: 'min(62%, 620px)',
      aspectRatio: '1',
      transform: 'translate(-50%,-50%)',
      borderRadius: '50%',
      border: '1px solid rgba(216,181,120,.28)',
      background:
        'radial-gradient(circle at 38% 32%, rgba(48,70,150,.35), rgba(7,12,22,.95) 62%)',
      boxShadow: '0 0 120px 24px rgba(48,70,150,.18)',
      opacity: '0',
      transition: 'opacity 1.2s ease',
    });
    this.el.insertBefore(disc, this._label);
    requestAnimationFrame(() => {
      disc.style.opacity = '1';
    });
    this._fallbackEl = disc;
  }

  /* ---------------------------------------------------------------- geometry */

  _ll(lat, lon, r) {
    const phi = ((90 - lat) * Math.PI) / 180;
    const th = ((lon + 180) * Math.PI) / 180;
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(th),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(th)
    );
  }

  _makeGlowTex() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.35, 'rgba(255,255,255,.45)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }

  _stars(n, color, size, opacity) {
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 5 + Math.random() * 5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph);
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const m = new THREE.PointsMaterial({
      color,
      size,
      map: this._glowTex,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this._disposables.push(g, m);
    return new THREE.Points(g, m);
  }

  async _loadLand() {
    try {
      const res = await fetch(LAND_URL);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const topo = await res.json();
      if (this._dead) return;

      const m = topoMesh(topo, topo.objects.land);
      const pts = [];
      for (const line of m.coordinates) {
        for (let i = 0; i < line.length - 1; i++) {
          const a = this._ll(line[i][1], line[i][0], 1.001);
          const b = this._ll(line[i + 1][1], line[i + 1][0], 1.001);
          pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      const mat = new THREE.LineBasicMaterial({ color: 0xc8a76b, transparent: true, opacity: 0 });
      const lines = new THREE.LineSegments(g, mat);
      this._world.add(lines);
      this._disposables.push(g, mat);

      const t0 = performance.now();
      const fade = () => {
        if (this._dead) return;
        const p = Math.min(1, (performance.now() - t0) / 1600);
        mat.opacity = p * 0.85;
        if (p < 1) requestAnimationFrame(fade);
      };
      fade();
    } catch (e) {
      console.warn('land data unavailable', e);
    }
  }

  _buildMarkers() {
    if (!this._world) return;
    if (this._mGroup) this._world.remove(this._mGroup);
    const grp = (this._mGroup = new THREE.Group());
    this._mObjs = [];
    this._hits = [];

    for (const c of this._markers) {
      const p = this._ll(c.lat, c.lon, 1.005);

      const dotGeo = new THREE.SphereGeometry(0.0095, 14, 14);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xe8c98a });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(p);

      const glowMat = new THREE.SpriteMaterial({
        map: this._glowTex,
        color: 0xe0b56e,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const glow = new THREE.Sprite(glowMat);
      glow.scale.setScalar(0.08);
      glow.position.copy(p.clone().multiplyScalar(1.012));

      const ringGeo = new THREE.RingGeometry(0.014, 0.016, 40);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xd8b578,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(p.clone().multiplyScalar(1.002));
      ring.lookAt(p.clone().multiplyScalar(2));

      const hitGeo = new THREE.SphereGeometry(0.05, 8, 8);
      const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
      const hit = new THREE.Mesh(hitGeo, hitMat);
      hit.position.copy(p);
      hit.userData.cityId = c.id;
      hit.userData.cityName = c.name;

      grp.add(dot, glow, ring, hit);
      this._hits.push(hit);
      this._mObjs.push({ id: c.id, name: c.name, dot, glow, ring, base: p, phase: Math.random() });
      this._disposables.push(dotGeo, dotMat, glowMat, ringGeo, ringMat, hitGeo, hitMat);
    }
    this._world.add(grp);
  }

  /* ------------------------------------------------------------------ input */

  _bindInput(el) {
    el.addEventListener('pointerdown', (e) => {
      el.setPointerCapture(e.pointerId);
      this._drag = { x: e.clientX, y: e.clientY, moved: 0 };
      this._tween = null;
      this._vel = { x: 0, y: 0 };
      el.style.cursor = 'grabbing';
    });

    el.addEventListener('pointermove', (e) => {
      if (this._drag) {
        const dx = e.clientX - this._drag.x;
        const dy = e.clientY - this._drag.y;
        this._drag.x = e.clientX;
        this._drag.y = e.clientY;
        this._drag.moved += Math.abs(dx) + Math.abs(dy);
        const r = this._world.rotation;
        r.y += dx * 0.005;
        r.x = clamp(r.x + dy * 0.0032, -0.9, 0.9);
        this._vel = { x: dy * 0.0032, y: dx * 0.005 };
      } else {
        this._updateHover(e);
      }
    });

    const end = (e) => {
      if (!this._drag) return;
      const clicked = this._drag.moved < 6;
      this._drag = null;
      el.style.cursor = 'grab';
      if (!clicked) return;
      const hit = this._pick(e);
      if (hit) this._onSelect(hit.userData.cityId);
      else this._onClear();
    };

    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', () => {
      this._drag = null;
      el.style.cursor = 'grab';
    });
    el.addEventListener('pointerleave', () => {
      this._hover = null;
      this._hoverObj = null;
      this._label.style.opacity = '0';
    });
    el.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this._targetZ = clamp(this._targetZ + e.deltaY * 0.0016, 1.7, 3.6);
      },
      { passive: false }
    );
  }

  _ndc(e) {
    const r = this._renderer.domElement.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * 2 - 1,
      y: -((e.clientY - r.top) / r.height) * 2 + 1,
    };
  }

  /** Returns the marker hit-sphere under the pointer, or null. The base sphere
      is included in the raycast so markers on the far side stay unclickable. */
  _pick(e) {
    if (!this._hits || !this._hits.length) return null;
    this._ray.setFromCamera(this._ndc(e), this._cam);
    const sphere = this._world.children[0];
    const all = this._ray.intersectObjects([sphere, ...this._hits], false);
    if (all.length && all[0].object.userData.cityId) return all[0].object;
    return null;
  }

  _updateHover(e) {
    const hit = this._pick(e);
    const id = hit ? hit.userData.cityId : null;
    this._hover = id;
    this._renderer.domElement.style.cursor = id ? 'pointer' : 'grab';
    if (id) {
      this._label.textContent = hit.userData.cityName;
      this._label.style.opacity = '1';
      this._hoverObj = this._mObjs.find((m) => m.id === id) || null;
    } else {
      this._label.style.opacity = '0';
      this._hoverObj = null;
    }
  }

  _focus(id) {
    const m = (this._mObjs || []).find((o) => o.id === id);
    if (!m) return;
    const v = m.base;
    const L = Math.hypot(v.x, v.z);
    const cur = this._world.rotation;
    let toY = Math.atan2(-v.x, v.z);
    while (toY - cur.y > Math.PI) toY -= Math.PI * 2;
    while (toY - cur.y < -Math.PI) toY += Math.PI * 2;
    this._tween = {
      t0: performance.now(),
      dur: 1100,
      fx: cur.x,
      fy: cur.y,
      tx: Math.atan2(v.y, L) * 0.82,
      ty: toY,
    };
    this._targetZ = 2.12;
  }

  /* ------------------------------------------------------------------- frame */

  _tick(now, dt) {
    const r = this._world.rotation;

    if (this._tween) {
      const p = Math.min(1, (now - this._tween.t0) / this._tween.dur);
      const k = ease(p);
      r.x = this._tween.fx + (this._tween.tx - this._tween.fx) * k;
      r.y = this._tween.fy + (this._tween.ty - this._tween.fy) * k;
      if (p >= 1) this._tween = null;
    } else if (!this._drag) {
      if (Math.abs(this._vel.y) > 0.00004 || Math.abs(this._vel.x) > 0.00004) {
        r.y += this._vel.y * dt;
        r.x = clamp(r.x + this._vel.x * dt, -0.9, 0.9);
        this._vel.x *= Math.pow(0.93, dt);
        this._vel.y *= Math.pow(0.93, dt);
      } else if (this._auto && !this._sel) {
        r.y += 0.0011 * this._speed * dt;
      }
    }

    this._cam.position.z += (this._targetZ - this._cam.position.z) * 0.055 * dt;

    const t = now * 0.00045;
    for (const m of this._mObjs || []) {
      const isSel = m.id === this._sel;
      const isHov = this._hover === m.id;
      const ts = isSel ? 1.9 : isHov ? 1.5 : 1;
      const s = m.dot.scale.x + (ts - m.dot.scale.x) * 0.12 * dt;
      m.dot.scale.setScalar(s);
      m.dot.material.color.setHex(isSel ? 0xffe3a6 : 0xe8c98a);
      m.glow.material.opacity = isSel ? 0.95 : isHov ? 0.8 : 0.55;
      m.glow.scale.setScalar(isSel ? 0.13 : 0.08);
      const prog = (t + m.phase) % 1;
      m.ring.scale.setScalar(1 + prog * 2.2);
      m.ring.material.opacity = (1 - prog) * (isSel ? 0.9 : 0.38);
    }

    if (this._hoverObj) {
      const wp = this._hoverObj.dot.getWorldPosition(new THREE.Vector3());
      if (wp.z < 0.1) {
        this._label.style.opacity = '0';
      } else {
        const pr = wp.clone().project(this._cam);
        const rect = this._renderer.domElement.getBoundingClientRect();
        this._label.style.opacity = '1';
        this._label.style.transform =
          'translate(' +
          ((pr.x * 0.5 + 0.5) * rect.width - this._label.offsetWidth / 2) +
          'px,' +
          ((-pr.y * 0.5 + 0.5) * rect.height - this._label.offsetHeight - 18) +
          'px)';
      }
    }
  }
}

export function createGlobe(container, opts) {
  return new Globe(container, opts);
}
