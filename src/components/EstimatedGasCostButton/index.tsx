import { useContext, useEffect, useMemo, useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '../UI/Typography';
import formatAmount from '../../utils/general/formatAmount';
import getUserReadableAmount from '../../utils/contracts/getUserReadableAmount';
import { WalletContext } from '../../contexts/Wallet';
import { AssetsContext } from '../../contexts/Assets';

export interface Props {
  gas: number;
}

const EstimatedGasCostButton = ({ gas }: Props) => {
  const { tokenPrices } = useContext(AssetsContext);
  const { provider } = useContext(WalletContext);
  const [estimatedGasCost, setEstimatedGasCost] = useState<number>(0);

  const updateEstimatedGasCost = async () => {
    const feeData = await provider.getFeeData();
    setEstimatedGasCost(
      getUserReadableAmount(gas * feeData['gasPrice'].toNumber(), 18)
    );
  };

  const estimatedGasCostInUsd = useMemo(() => {
    let ethPriceInUsd = 0;
    tokenPrices.map((record) => {
      if (record['name'] === 'ETH') ethPriceInUsd = record['price'];
    });
    return estimatedGasCost * ethPriceInUsd;
  }, [estimatedGasCost, tokenPrices]);

  useEffect(() => {
    updateEstimatedGasCost();
  }, []);

  return (
    <Box className={'flex'}>
      <Typography variant="h6" className="text-stieglitz ml-0 mr-auto flex">
        <img src="/assets/gasicon.svg" className="mt-1.5 mr-2" /> Est. Gas Cost
      </Typography>
      <Box className={'text-right'}>
        <Typography variant="h6" className="text-white mr-auto ml-0 flex">
          <span className="opacity-70 mr-2">
            ~${formatAmount(estimatedGasCostInUsd, 2)}
          </span>
          {formatAmount(estimatedGasCost, 5)} ETH
        </Typography>
      </Box>
    </Box>
  );
};

export default EstimatedGasCostButton;
