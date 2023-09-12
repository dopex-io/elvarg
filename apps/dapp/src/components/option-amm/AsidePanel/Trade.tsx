import { useState } from 'react';
import { formatUnits } from 'viem';

import { Button } from '@dopex-io/ui';

import ExpirySelector from 'components/option-amm/AsidePanel/Dropdowns/ExpirySelector';
import OptionTypeSelector from 'components/option-amm/AsidePanel/Dropdowns/OptionTypeSelector';
import ManageMargin from 'components/option-amm/Dialog/ManageMargin';
import RowItem from 'components/ssov-beta/AsidePanel/RowItem';

import { DECIMALS_STRIKE } from 'constants/index';

interface Props {
  inputPanel: React.ReactNode;
  data: {
    strike: bigint;
    health: bigint;
    availableCollateral: bigint;
    newMaintenanceMargin: bigint;
  };
  button: {
    label: string;
    handler: (e: any) => void;
    disabled: boolean;
  };
}

const Trade = (props: Props) => {
  const { inputPanel, data, button } = props;

  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <div className="space-y-3">
      <div className="bg-umbra rounded-xl divide-y-2 divide-cod-gray">
        {inputPanel}
        <div className="flex w-full divide-x-2 divide-cod-gray">
          <div className="w-1/2 p-3 space-y-2">
            <h3 className="text-xs text-stieglitz">Expiry</h3>
            <ExpirySelector />
          </div>
          <div className="flex-grow p-3 space-y-2">
            <h3 className="text-xs text-stieglitz">Side</h3>
            <OptionTypeSelector />
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-umbra rounded-xl p-3 space-y-2">
        <RowItem
          label="Health Factor"
          content={<p>{formatUnits(data.health || 0n, 4)}</p>}
        />
        <RowItem
          label="Available Margin"
          content={
            <p>
              ${formatUnits(data.availableCollateral || 0n, DECIMALS_STRIKE)}
            </p>
          }
        />
        <RowItem
          label="Health Factor"
          content={<p>{formatUnits(data.health || 0n, 4)}</p>}
        />
        <RowItem label="Fees" content={<p>-</p>} />
        <Button
          className="flex-grow text-sm justify-center font-normal transition ease-in-out duration-200 bg-carbon"
          onClick={handleClick}
          color="mineshaft"
          size="small"
        >
          Add Margin
        </Button>
        <Button
          className="flex-grow text-sm justify-center font-normal transition ease-in-out duration-200 bg-carbon"
          onClick={button.handler}
          disabled={button.disabled}
          size="small"
        >
          {button.label}
        </Button>
      </div>
      <ManageMargin
        open={open}
        handleClose={handleClose}
        data={{
          health: data.health,
          availableCollateral: data.availableCollateral,
        }}
      />
    </div>
  );
};

export default Trade;
