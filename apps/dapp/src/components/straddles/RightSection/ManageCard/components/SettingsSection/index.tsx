import { Dispatch, SetStateAction } from 'react';

import cx from 'classnames';

type SettingsSectionProps = {
  isPurchase: boolean;
  setIsPurchase: Dispatch<SetStateAction<boolean>>;
};

const SettingsSection = (props: SettingsSectionProps) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="w-max-content flex items-center justify-left text-md space-x-2">
        <div
          role="button"
          onClick={() => props.setIsPurchase(true)}
          className={cx(
            'w-max-content hover:text-white transition-colors duration-300 ease-in-out',
            props.isPurchase ? 'text-white' : 'text-stieglitz',
          )}
        >
          Buy
        </div>
        <div
          role="button"
          onClick={() => props.setIsPurchase(false)}
          className={cx(
            'w-max-content hover:text-white transition-colors duration-300 ease-in-out',
            props.isPurchase ? 'text-stieglitz' : 'text-white',
          )}
        >
          Sell
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
