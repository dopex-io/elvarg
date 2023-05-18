import { useRouter } from 'next/router';

import { NextSeo } from 'next-seo';

import AppBar from 'components/common/AppBar';
import Manage from 'components/ssov/Manage';

import seo from 'constants/seo';

const SsovV3Page = () => {
  const router = useRouter();
  const ssovQuery = router.query['ssov'];
  const ssov = ssovQuery as unknown as string;

  return (
    <div className="overflow-x-hidden bg-black h-screen">
      <NextSeo
        title={`${ssov} SSOV | Dopex Single Staking Options Vault`}
        description="Sell covered options to earn yield"
        canonical={`https://dopex.io/ssov/${ssov}`}
        openGraph={{
          url: `https://dopex.io/ssov/${ssov}`,
          title: `${ssov} SSOV | Dopex Single Staking Options Vault`,
          description: 'Sell covered options to earn yield',
          images: [
            {
              url: seo.ssov,
              width: 800,
              height: 450,
              alt: 'SSOV',
              type: 'image/png',
            },
          ],
        }}
      />
      <AppBar active="SSOV" />
      <Manage ssov={ssov} />
    </div>
  );
};

export default SsovV3Page;
