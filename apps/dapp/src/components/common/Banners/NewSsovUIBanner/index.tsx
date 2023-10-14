import { useCallback } from 'react';
import { useRouter } from 'next/router';

import { Button } from '@dopex-io/ui';

const NewSsovUIBanner = () => {
  const router = useRouter();

  const handleRedirect = useCallback(() => {
    router.push('/ssov-beta/ARB');
  }, [router]);

  return (
    <div className="w-fit mx-auto mt-32 mb-4 lg:mb-8 bg-primary rounded-lg p-2 h-full flex">
      <div className="text-white flex justify-between space-x-4">
        <span className="text-left break-before-all my-auto w-4/5">
          Our new SSOV Interface is currently live for Beta testing!{' '}
        </span>
        <Button
          className="bg-white text-black rounded-md px-2 py-1 w-1/5 my-auto"
          onClick={handleRedirect}
        >
          <span className="text-sm text-primary my-2">Launch</span>
        </Button>
      </div>
    </div>
  );
};

export default NewSsovUIBanner;
