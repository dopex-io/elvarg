import { useRouter } from 'next/router';

import Manage from 'components/ssov/Manage';

const SsovV3Page = () => {
  const router = useRouter();
  const ssovQuery = router.query['ssov'];
  const ssov = ssovQuery as unknown as string;

  return <Manage ssov={ssov} />;
};

export default SsovV3Page;
