/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hostinger Node plans cannot afford Sharp/image optimization on every request.
  // Header already uses unoptimized images for the same reason.
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["@prisma/client", "prisma"],
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
