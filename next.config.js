module.exports = {
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
