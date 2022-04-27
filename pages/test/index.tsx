import React from 'react';
import { useRouter } from 'next/router';
const Index = () => {
  const { asPath } = useRouter();
  return <div>{asPath}</div>;
};

export default Index;
