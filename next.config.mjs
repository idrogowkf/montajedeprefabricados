/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdfkit', 'fontkit', 'iconv-lite'],
  },
  images: {
    unoptimized: false,
  },
  reactStrictMode: true,
  async redirects() {
    return [{
      source: '/servicios/montaje-prefabricado-hormigon',
      destination: '/servicios/montaje-prefabricados',
      permanent: true,
    }];
  },
};

export default nextConfig;
