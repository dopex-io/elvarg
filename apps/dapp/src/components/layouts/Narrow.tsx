import { ReactNode } from 'react';

const Narrow = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-black flex w-screen items-center justify-center">
      <div className="my-32 md:w-[70vw] h-full">{children}</div>
    </div>
  );
};

export default Narrow;
