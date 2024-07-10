/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "agile-wildebeest-318.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
