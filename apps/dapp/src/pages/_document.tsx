import { Html, Head, Main, NextScript } from 'next/document';
import { NextSeo } from 'next-seo';

function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#342268" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <NextSeo
          title="SSOV | Dopex"
          description="Dopex Single Staking Option Vaults"
          canonical="https://app.dopex.io/ssov"
          openGraph={{
            url: 'https://app.dopex.io/ssov',
            title: 'SSOV | Dopex',
            description: 'Dopex Single Staking Option Vaults',
            images: [
              {
                url: '/previews/ssov.png',
                width: 800,
                height: 600,
                alt: 'SSOV',
                type: 'image/png',
              },
            ],
          }}
          twitter={{
            handle: '@handle',
            site: '@site',
            cardType: 'summary_large_image',
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
