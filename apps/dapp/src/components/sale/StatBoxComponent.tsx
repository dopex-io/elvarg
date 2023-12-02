import { ReactNode } from 'react';

import Equal from 'svgs/icons/Equal';

import { cn } from 'utils/general';

interface StatBoxProps {
  Top: ReactNode;
  Bottom: ReactNode;
}

const StatBox = ({ Top, Bottom }: StatBoxProps) => {
  return (
    <div className="flex flex-col">
      <div className="text-wave-blue flex flex-row items-center text-xl">
        <Equal className={cn('hidden mr-2')} />
        {Top}
      </div>
      <div className="flex flex-row items-center">
        <div className="text-stieglitz text-sm">{Bottom}</div>
      </div>
    </div>
  );
};
export default StatBox;
