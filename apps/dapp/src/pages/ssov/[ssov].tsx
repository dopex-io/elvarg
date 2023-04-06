import { useRouter } from 'next/router';
import Head from 'next/head';

import AppBar from 'components/common/AppBar';

import Manage from 'components/ssov/Manage';

const SsovV3Page = () => {
  const router = useRouter();
  const ssovQuery = router.query['ssov'];
  const ssov = ssovQuery as unknown as string;

  return (
    <div className="overflow-x-hidden bg-black h-screen">
      <Head>
        <title>SSOV | Dopex</title>
      </Head>
      <AppBar active="SSOV" />
      <Manage ssov={ssov} />
    </div>
  );
};

export default SsovV3Page;
