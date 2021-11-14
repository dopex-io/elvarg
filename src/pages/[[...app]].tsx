import { useState, useEffect } from 'react';
import Script from 'next/script';

import CreateReactAppEntryPoint from '../App';

function App() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateReactAppEntryPoint />
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-N9THR532G6"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-N9THR532G6');
        `}
      </Script>
    </>
  );
}

export default App;
