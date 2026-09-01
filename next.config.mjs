/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hostinger Node plans cannot afford Sharp/image optimization on every request.
  // Header already uses unoptimized images for the same reason.
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
