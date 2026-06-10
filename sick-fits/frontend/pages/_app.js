import { ApolloProvider } from '@apollo/client';
import Router from 'next/router';
import NProgress from 'nprogress';
import { Archivo } from 'next/font/google';
import localFont from 'next/font/local';
import Page from '../components/Page';
import withData from '../lib/withData';

// Use default nprogress styles
import 'nprogress/nprogress.css';
import { CartStateProvider } from '../lib/cartState';
import '../styles/globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap'
});

const radnika = localFont({
  src: '../public/static/radnikanext-medium-webfont.woff2',
  variable: '--font-radnika',
  display: 'swap'
});

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps, apollo }) {
  console.log(apollo);
  return (
    <ApolloProvider client={apollo}>
      <CartStateProvider>
        <div className={`${archivo.className} ${radnika.variable} ${radnika.className}`}>
          <Page>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Component {...pageProps} />
          </Page>
        </div>
      </CartStateProvider>
    </ApolloProvider>
  );
}
MyApp.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query;
  return { pageProps };
};
export default withData(MyApp);
