'use client';

import { useEffect, useRef } from 'react';
import { createGlobe } from '@/lib/globe-engine';

type Marker = { id: string; name: string; lat: number; lon: number };

type GlobeProps = {
  markers: Marker[];
  selected: string | null;
  autoRotate?: boolean;
  speed?: number;
  onSelect: (id: string) => void;
  onClear: () => void;
  className?: string;
};

export default function Globe({
  markers,
  selected,
  autoRotate = true,
  speed = 1,
  onSelect,
  onClear,
  className,
}: GlobeProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);

  // Keep the latest callbacks reachable without re-creating the WebGL scene.
  const handlers = useRef({ onSelect, onClear });
  handlers.current = { onSelect, onClear };

  useEffect(() => {
    if (!hostRef.current) return;
    const globe = createGlobe(hostRef.current, {
      markers,
      selected,
      autoRotate,
      speed,
      onSelect: (id: string) => handlers.current.onSelect(id),
      onClear: () => handlers.current.onClear(),
    });
    globeRef.current = globe;
    return () => {
      globe.destroy();
      globeRef.current = null;
    };
    // The scene is built once; prop changes are pushed through the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    globeRef.current?.setMarkers(markers);
  }, [markers]);

  useEffect(() => {
    globeRef.current?.setSelected(selected);
  }, [selected]);

  useEffect(() => {
    globeRef.current?.setAutoRotate(autoRotate);
  }, [autoRotate]);

  useEffect(() => {
    globeRef.current?.setSpeed(speed);
  }, [speed]);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
