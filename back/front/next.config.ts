import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['my-bucket-quick.s3.amazonaws.com'], // Adicione o domínio do seu bucket S3 aqui
  },
};

export default nextConfig;
