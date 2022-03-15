import { useEffect } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';

export default function Custom500() {
  useEffect(() => {
    window.location.replace('/');
  }, []);

  return (
    <Box className="overflow-x-hidden bg-black h-screen">
      <Head>
        <title>Error | Dopex</title>
      </Head>
      <h1>500 - Server-side error occurred</h1>
    </Box>
  );
}
