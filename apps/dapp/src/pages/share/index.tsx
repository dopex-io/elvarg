import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import Router from 'next/router';
import { useEffect } from 'react';

const Share = ({
  imageUrl,
  redirectTo,
}: {
  imageUrl: string;
  redirectTo: string;
}) => {
  useEffect(() => {
    Router.push(redirectTo);
  });

  return (
    <NextSeo
      title="Dopex | Decentralized Options Exchange"
      description="Trade options and various other option related strategies on-chain"
      canonical="https://app.dopex.io/"
      openGraph={{
        url: 'https://app.dopex.io/',
        title: 'Dopex | Decentralized Options Exchange',
        description:
          'Trade options and various other option related strategies on-chain',
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: 'Share Image',
            type: 'image/png',
          },
        ],
        siteName: 'SiteName',
      }}
      twitter={{
        handle: '@handle',
        site: '@site',
        cardType: 'summary_large_image',
      }}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      imageUrl: context.query['imageUrl'],
      redirectTo: context.query['redirectTo'],
    },
  };
};

export default Share;
