module.exports = {
  reactStrictMode: false,
  images: {
    domains: ['api.owenstack.com']
  },
  compiler: {
    // fileName:false keeps the generated component ids out of the checkout
    // path: with the default (true) the id is hashed from the absolute file
    // path, so the same component renders as sc-8353ba04-1 on one machine and
    // sc-734fea1b-1 on another. That made the jest DOM snapshots unportable
    // (green locally, red in CI) and made every build non-reproducible.
    styledComponents: {
      displayName: true,
      ssr: true,
      fileName: false
    }
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