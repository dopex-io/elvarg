import { ReactNode } from 'react';

import AppBar from 'components/common/AppBar';

const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-black flex w-screen items-center justify-center">
      <AppBar />
      <div className="my-12 mx-[15%]">{children}</div>
    </div>
  );
};

export default PageLayout;
