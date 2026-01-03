module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['your-backend-domain.com'], // Replace with your actual backend domain
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://your-backend.herokuapp.com/api/:path*',
      },
    ];
  },
};
