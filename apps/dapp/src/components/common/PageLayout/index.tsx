import { ReactNode } from 'react';

import AppBar from 'components/common/AppBar';

const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-black flex w-screen items-center justify-center">
      <AppBar />
      <div className="my-20 w-[70vw]">{children}</div>
      {/* note: clarify with polymmo the layout sizing for a normal viewport */}
    </div>
  );
};

export default PageLayout;
