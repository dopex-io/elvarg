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
        title={`${ssov} ${seo.ssov.title}`}
        description={seo.ssov.description}
        canonical={`${seo.ssov.url}/${ssov}`}
        openGraph={{
          url: `${seo.ssov.url}/${ssov}`,
          title: `${ssov} ${seo.ssov.title}`,
          description: seo.ssov.description,
          images: [
            {
              url: seo.ssov.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.ssov.alt,
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
