/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "evotor.ru",
        pathname: "/static/**",
      },
    ],
  },
};

export default nextConfig;
