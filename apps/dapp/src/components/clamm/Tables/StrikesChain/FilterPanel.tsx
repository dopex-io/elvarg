import { useBoundStore } from 'store';

import RefreshIcon from '../Positions/components/RefreshIcon';

const FilterPanel = ({ reload }: { reload: any }) => {
  const { isPut, setIsPut } = useBoundStore();

  const handleIsPut = (isPut: boolean) => {
    setIsPut(isPut);
  };

  return (
    <div className="flex space-x-2 z-10 items-center justify-between">
      <div className="bg-mineshaft rounded-md p-1 relative flex text-xs">
        <div className="relative w-fit rounded-sm p-1">
          <div
            className={`rounded-[4px] top-0 absolute transform h-full w-full ${
              !isPut
                ? 'translate-x-0 bg-black left-0 bg-opacity-30'
                : 'translate-x-full right-0 bg-opacity-0'
            } duration-500`}
          />
          <button
            onClick={() => handleIsPut(false)}
            className={`px-1 rounded-sm`}
          >
            Call
          </button>
        </div>
        <div className="relative w-fit rounded-sm p-1">
          <div
            className={`rounded-[4px] top-0 absolute transform h-full w-full ${
              isPut
                ? 'translate-x-0 bg-black left-0 bg-opacity-30'
                : 'translate-x-full right-0 bg-opacity-0'
            } duration-500`}
          />
          <button
            onClick={() => handleIsPut(true)}
            className={`px-1 rounded-sm`}
          >
            Put
          </button>
        </div>
      </div>
      <div className="pr-4 text-stieglitz" onClick={reload}>
        <RefreshIcon />
      </div>
    </div>
  );
};

export default FilterPanel;
