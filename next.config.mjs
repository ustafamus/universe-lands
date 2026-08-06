import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',

  // This folder is the workspace root (there are other lockfiles further up the tree).
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),

  // Allow the dev server to be reached through a Cloudflare Tunnel
  // (quick tunnels land on *.trycloudflare.com) or any other proxy host.
  allowedDevOrigins: [
    '*.trycloudflare.com',
    '*.cfargotunnel.com',
    // Add your own tunnel hostname here, e.g. 'demo.example.com'
    ...(process.env.TUNNEL_HOST ? [process.env.TUNNEL_HOST] : []),
  ],
};

export default nextConfig;
