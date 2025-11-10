/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Evita problemas de bundling con pdfkit/fontkit en runtime de Node
    serverComponentsExternalPackages: ['pdfkit', 'fontkit', 'iconv-lite'],
  },
  // (opcional) si usas imágenes externas añade domains aquí
  images: {
    unoptimized: false,
  },
  reactStrictMode: true,
};

export default nextConfig;
