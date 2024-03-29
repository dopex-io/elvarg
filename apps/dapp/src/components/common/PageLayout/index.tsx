import { ReactNode } from 'react';

import AppBar from 'components/common/AppBar';

const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-black flex w-screen items-center justify-center">
      <AppBar />
      <div className="my-20 md:w-[90vw] h-full">{children}</div>
      {/* note: standardize viewport */}
    </div>
  );
};

export default PageLayout;
