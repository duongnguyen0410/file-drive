const hostnames = ["agile-wildebeest-318.convex.cloud", "img.clerk.com"];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: hostnames.map(hostname => ({
        protocol: 'https',
        hostname
    }))
  }
}

export default nextConfig;
