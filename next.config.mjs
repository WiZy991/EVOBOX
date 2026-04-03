/** @type {import('next').NextConfig} */
const nextConfig = {
  /** Меньше параллельных воркеров при сборке — ниже пик RAM (малый VPS, избегаем SIGBUS/OOM) */
  experimental: {
    cpus: 1,
  },
  /**
   * Standalone нужен Docker’у (меньший образ). На слабом VPS сборка с standalone сильнее жрёт RAM.
   * На сервере без Docker: `SKIP_STANDALONE=1 npm run build`, затем `npm start` / PM2.
   */
  ...(process.env.SKIP_STANDALONE === "1" ? {} : { output: "standalone" }),
  /** Без sharp — меньше нативного кода при сборке (избегаем SIGBUS на малом VPS). Картинки как обычные <img>. */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "evotor.ru",
        pathname: "/static/**",
      },
    ],
  },
  /** Линт в CI/локально; на слабом сервере экономит память при `next build` */
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
