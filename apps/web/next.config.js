/** @type {import('next').NextConfig} */
const nextConfig = (phase) => ({
  // Keep the development router cache separate from the production build output.
  distDir: phase === "phase-development-server" ? ".next-dev" : ".next",
});

export default nextConfig;
