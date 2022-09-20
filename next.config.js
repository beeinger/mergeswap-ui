/** @type {import('next').NextConfig} */

let nextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
};


// Configure Next.js for statically rendering for IPFS.
if(process.env.NEXT_EXPORT) {
  nextConfig = {
    ...nextConfig,
    images: {
      unoptimized: true,
    }
  }
}


module.exports = nextConfig;
