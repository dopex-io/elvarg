import { NextSeo } from 'next-seo';

import { TokenPair } from 'components/clamm/TokenPair';
import AppBar from 'components/common/AppBar';
import PageLayout from 'components/common/PageLayout';

import seo from 'constants/seo';

const ClammPage = () => {
  return (
    <div className="overflow-x-hidden bg-black h-screen">
      <NextSeo
        title={`${seo.clamm.title}`}
        description={seo.clamm.description}
        canonical={seo.clamm.url}
        openGraph={{
          url: seo.clamm.url,
          title: seo.clamm.title,
          description: seo.clamm.description,
          images: [
            {
              url: seo.clamm.banner,
              width: seo.default.width,
              height: seo.default.height,
              alt: seo.clamm.alt,
              type: 'image/png',
            },
          ],
        }}
      />
      <AppBar />
      <PageLayout>
        <TokenPair />
      </PageLayout>
    </div>
  );
};

export default ClammPage;
