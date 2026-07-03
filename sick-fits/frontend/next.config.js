module.exports = {
  reactStrictMode: false,
  images: {
    domains: ['api.owenstack.com']
  },
  compiler: {
    styledComponents: true
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/products',
        permanent: true,
      },
    ];
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://your-backend.herokuapp.com/api/:path*',
  //     },
  //   ];
  // },
};