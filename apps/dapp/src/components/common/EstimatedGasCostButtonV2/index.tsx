import { useEffect, useMemo, useState } from 'react';
import { BigNumber } from 'ethers';

import Box from '@mui/material/Box';

import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { CURRENCIES_MAP } from 'constants/index';

export interface Props {
  gas: number;
  chainId: number;
}

const EstimatedGasCostButton = ({ gas, chainId }: Props) => {
  const { tokenPrices, provider } = useBoundStore();

  const [estimatedGasCost, setEstimatedGasCost] = useState<number>(0);

  const estimatedGasCostInUsd = useMemo(() => {
    let tokenPriceInUsd = 0;
    tokenPrices.map((record) => {
      if (record['name'] === CURRENCIES_MAP[chainId.toString()])
        tokenPriceInUsd = record['price'];
    });
    return estimatedGasCost * tokenPriceInUsd;
  }, [estimatedGasCost, tokenPrices, chainId]);

  useEffect(() => {
    const updateEstimatedGasCost = async () => {
      if (!provider) return;
      const feeData = await provider.getFeeData();
      if (feeData.gasPrice)
        setEstimatedGasCost(
          getUserReadableAmount(
            BigNumber.from(String(gas)).mul(feeData.gasPrice),
            18
          )
        );
    };
    updateEstimatedGasCost();
  }, [provider, gas]);

  return (
    <Box className={'flex flex-row justify-between'}>
      <Typography variant="h6" className="text-stieglitz ml-0 mr-auto flex">
        Est. Gas Cost
      </Typography>
      <Box className={'text-right'}>
        <Typography variant="h6" className="text-white mr-auto ml-0 flex">
          <span className="opacity-70 mr-2">
            ~${formatAmount(estimatedGasCostInUsd, 2)}
          </span>
          {formatAmount(estimatedGasCost, 5)}{' '}
          {CURRENCIES_MAP[chainId.toString()]}
        </Typography>
      </Box>
    </Box>
  );
};

export default EstimatedGasCostButton;
