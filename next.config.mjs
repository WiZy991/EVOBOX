/** @type {import('next').NextConfig} */
const nextConfig = {
  /** Меньше параллельных воркеров при сборке — ниже пик RAM (малый VPS, избегаем SIGBUS/OOM) */
  experimental: {
    cpus: 1,
  },
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
