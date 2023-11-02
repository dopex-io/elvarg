import cx from 'classnames';

import useClammStore from 'hooks/clamm/useClammStore';

const FilterPanel = () => {
  const { setIsTrade, setIsPut, isTrade, isPut } = useClammStore();

  return (
    <div className="m-[12px] h-[30px] flex items-center justify-center space-x-[12px] w-fit">
      <div className="rounded-md h-[32px] bg-mineshaft flex items-center justify-center space-x-[4px] p-[4px]">
        <div
          role="button"
          onClick={() => setIsPut(false)}
          className={`h-full flex items-center justify-center`}
        >
          <span
            className={cx(
              !isPut && 'bg-carbon',
              'p-[4px] rounded-md font-medium text-[13px]',
            )}
          >
            Calls
          </span>
        </div>
        <div
          role="button"
          onClick={() => setIsPut(true)}
          className="h-full flex items-center justify-center"
        >
          <span
            className={cx(
              isPut && 'bg-carbon',
              'p-[4px] rounded-md font-medium text-[13px]',
            )}
          >
            Puts
          </span>
        </div>
      </div>
      <div className="rounded-md h-[32px] bg-mineshaft flex items-center justify-center space-x-[4px] p-[4px]">
        <div
          role="button"
          onClick={() => setIsTrade(true)}
          className="h-full flex items-center justify-center"
        >
          <span
            className={cx(
              isTrade && 'bg-carbon',
              'p-[4px] rounded-md font-medium text-[13px]',
            )}
          >
            Trade
          </span>
        </div>
        <div
          role="button"
          onClick={() => setIsTrade(false)}
          className="h-full flex items-center justify-center"
        >
          <span
            className={cx(
              'p-[4px] rounded-md text-[13px] font-medium',
              !isTrade && 'bg-carbon',
            )}
          >
            Liquidity Provision
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
