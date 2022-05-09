import { useContext, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '../UI/Typography';
import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import { WalletContext } from 'contexts/Wallet';
import { AssetsContext } from 'contexts/Assets';
import { CURRENCIES_MAP } from 'constants/index';

export interface Props {
  gas: number;
  chainId: number;
}

const EstimatedGasCostButton = ({ gas, chainId }: Props) => {
  const { tokenPrices } = useContext(AssetsContext);
  const { provider } = useContext(WalletContext);
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
      const feeData = await provider.getFeeData();
      setEstimatedGasCost(
        getUserReadableAmount(gas * feeData['gasPrice'].toNumber(), 18)
      );
    };
    updateEstimatedGasCost();
  }, [provider, gas]);

  return (
    <Box className={'flex'}>
      <Typography variant="h6" className="text-stieglitz ml-0 mr-auto flex">
        <img
          src="/assets/gasicon.svg"
          className="mt-1.5 mr-2 h-[0.8rem]"
          alt={'Gas'}
        />{' '}
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
