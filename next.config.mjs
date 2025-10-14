
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
    images: {
      domains: ['api.atdmoney.in'],
    },
  };
  
  export default nextConfig;