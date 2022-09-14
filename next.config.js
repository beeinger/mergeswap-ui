/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  env: {
    NEXT_PUBLIC_POW_HTTP_PROVIDER: process.env.NEXT_PUBLIC_POW_HTTP_PROVIDER,
    NEXT_PUBLIC_POS_HTTP_PROVIDER: process.env.NEXT_PUBLIC_POS_HTTP_PROVIDER,
    NEXT_PUBLIC_DEPOSIT_POW_ADDRESS:
      process.env.NEXT_PUBLIC_DEPOSIT_POW_ADDRESS,
    NEXT_PUBLIC_DEPOSIT_BLOCKS_CONFIRMATIONS:
      process.env.NEXT_PUBLIC_DEPOSIT_BLOCKS_CONFIRMATIONS,
  },
};

module.exports = nextConfig;
