/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  env: {
    NEXT_PUBLIC_POW_HTTP_PROVIDER: process.env.NEXT_PUBLIC_POW_HTTP_PROVIDER,
    NEXT_PUBLIC_POS_HTTP_PROVIDER: process.env.NEXT_PUBLIC_POS_HTTP_PROVIDER,
  },
};

module.exports = nextConfig;
