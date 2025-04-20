/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  compiler: {
    removeConsole: process.env.NEXT_PUBLIC_NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        port: "",
      },
    ],
    // domains: ["images.unsplash.com", "img.freepik.com", "source.unsplash.com"],
  },
  experimental: {
    appDir: true, // เปิดใช้งาน App Router
  },
};

module.exports = nextConfig;
