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
        <svg
          width="12"
          height="13"
          viewBox="0 0 12 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mt-1.5 mr-2"
        >
          <path
            d="M11.1801 2.82L11.1867 2.81333L9.06008 0.686667C8.86675 0.493333 8.54675 0.493333 8.35341 0.686667C8.16008 0.88 8.16008 1.2 8.35341 1.39333L9.40675 2.44667C8.70675 2.71333 8.23341 3.42667 8.35341 4.25333C8.46008 4.98667 9.08675 5.58 9.82008 5.66C10.1334 5.69333 10.4067 5.64 10.6667 5.52667V10.3333C10.6667 10.7 10.3667 11 10.0001 11C9.63342 11 9.33342 10.7 9.33342 10.3333V7.33333C9.33342 6.6 8.73341 6 8.00008 6H7.33342V1.33333C7.33342 0.6 6.73342 0 6.00008 0H2.00008C1.26675 0 0.666748 0.6 0.666748 1.33333V11.3333C0.666748 11.7 0.966748 12 1.33341 12H6.66675C7.03341 12 7.33342 11.7 7.33342 11.3333V7H8.33342V10.24C8.33342 11.1133 8.96008 11.9067 9.82675 11.9933C10.8267 12.0933 11.6667 11.3133 11.6667 10.3333V4C11.6667 3.54 11.4801 3.12 11.1801 2.82ZM6.00008 4.66667H2.00008V2C2.00008 1.63333 2.30008 1.33333 2.66675 1.33333H5.33342C5.70008 1.33333 6.00008 1.63333 6.00008 2V4.66667ZM10.0001 4.66667C9.63342 4.66667 9.33342 4.36667 9.33342 4C9.33342 3.63333 9.63342 3.33333 10.0001 3.33333C10.3667 3.33333 10.6667 3.63333 10.6667 4C10.6667 4.36667 10.3667 4.66667 10.0001 4.66667Z"
            fill="#6DFFB9"
          />
        </svg>{' '}
        Est. Gas Cost
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
