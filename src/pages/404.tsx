import { useEffect } from 'react';

export default function Custom404() {
  useEffect(() => {
    window.location.replace('https://app.dopex.io');
  }, []);

  return <h1>404 - Page Not Found</h1>;
}
