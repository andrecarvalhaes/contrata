import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Static export apenas em produção (build para Firebase Hosting)
  // Em desenvolvimento (npm run dev) roda normalmente sem restrições
  ...(isProd ? { output: "export", trailingSlash: true } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
