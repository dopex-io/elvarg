import React, { useMemo } from 'react';

import { Switch } from '@mui/material';

import { Button } from '@dopex-io/ui';
import { formatDistance } from 'date-fns';

import { InputAmountType } from '../..';
import ErrorMessage from '../ErrorMessage';

type DepositInformationProps = {
  inputAmount: InputAmountType;
};
const DepositInformation = (props: DepositInformationProps) => {
  const meta = useMemo(() => {}, []);

  const greeks = useMemo(() => {
    return {
      iv: 50,
      rv: 60,
      theta: 1,
    };
  }, []);

  // const { delta, gamma, theta, vega } = computeOptionGreeks({
  //   spot: Number(formatUnits(data[1].result!, DECIMALS_STRIKE)),
  //   strike,
  //   expiryInYears: getTimeToExpirationInYears(
  //     Number(data[0].result!.expiry),
  //   ),
  //   ivInDecimals: iv / 100,
  //   isPut: data[2].result ?? false,
  // });

  return (
    <div className="w-full flex flex-col space-y-2">
      <ErrorMessage errorMessage="???????????????????????????? ???????????????????????????" />
      <IvAndGreeks {...greeks} />
      <DepositCardInformation />
      <Button>Approve</Button>
    </div>
  );
};

type CardInformationSectionProps = {
  depositAmount: string;
  setCompound: Function;
  setRollover: Function;
};

const DepositCardInformation = (props: any) => {
  return (
    <div className="flex flex-col bg-umbra p-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-stieglitz">Rollover</span>
        <Switch size="small" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-stieglitz">Compound</span>
        <Switch size="small" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-stieglitz">Withdrawable after</span>
        <span className="text-sm">
          {formatDistance(
            Number(new Date().getTime() + 86400000 * 3),
            Number(new Date()),
          )}
        </span>
      </div>
    </div>
  );
};

type IvAndGreeksProps = {
  iv: number;
  rv: number;
  theta: number;
};
const IvAndGreeks = (props: IvAndGreeksProps) => {
  return (
    <div className="w-full flex divide-x divide-umbra items-center justify-center h-min-content border border-umbra rounded-md">
      <div className="flex flex-1 flex-col p-1 items-center justify-center">
        <span className="text-sm">{props.iv}</span>
        <span className="text-xs text-stieglitz">IV</span>
      </div>
      <div className="flex flex-1 flex-col p-1 items-center justify-center">
        <span className="text-sm">{props.rv}</span>
        <span className="text-xs text-stieglitz">RV</span>
      </div>
      <div className="flex flex-1 flex-col p-1 items-center justify-center">
        <span className="text-sm">{props.theta}</span>
        <span className="text-xs text-stieglitz">Theta</span>
      </div>
    </div>
  );
};

export default DepositInformation;
