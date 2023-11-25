import { Metadata } from 'next';
import Script from 'next/script';

import AppBar from './components/AppBar';
import { Providers } from './providers';

import '@rainbow-me/rainbowkit/styles.css';
import 'tailwindcss/tailwind.css';
import '../style/index.css';
import '../wdyr';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppBar />
          {children}
        </Providers>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QLYLX4HN05"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-QLYLX4HN05');
        `}
        </Script>
      </body>
    </html>
  );
}
