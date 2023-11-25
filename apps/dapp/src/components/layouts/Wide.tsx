import { ReactNode } from 'react';

const Wide = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-black flex w-screen items-center justify-center">
      <div className="my-32 md:w-[90vw] h-full">{children}</div>
    </div>
  );
};

export default Wide;
