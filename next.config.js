const trueEnv = ['true', '1', 'yes'];

const NEXTJS_IGNORE_ESLINT = trueEnv.includes(
    process.env?.NEXTJS_IGNORE_ESLINT ?? 'false',
);
const NEXTJS_IGNORE_TYPECHECK = trueEnv.includes(
    process.env?.NEXTJS_IGNORE_TYPECHECK ?? 'false',
);

module.exports = {
  typescript: {
    ignoreBuildErrors: NEXTJS_IGNORE_TYPECHECK,
  },
  eslint: {
    ignoreDuringBuilds: NEXTJS_IGNORE_ESLINT,
    dirs: ['src'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['res.cloudinary.com'],
  },
  async rewrites() {
    return [
      {
        source: '/v1/rs',
        destination: '/api/v1/rs',
      },
    ];
  }
}
