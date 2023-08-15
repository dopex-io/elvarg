import { useEffect } from 'react';
import { useRouter } from 'next/router';

const FALLBACK_SLUG = '/ssov-beta/ARB';

const SsovBeta = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace(router.asPath, FALLBACK_SLUG);
  }, [router]);

  return <></>;
};

export default SsovBeta;
