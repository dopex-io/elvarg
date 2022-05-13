import { useContext } from 'react';
import Box from '@mui/material/Box';

import AddTokenButton from 'components/AddTokenButton';
import Typography from 'components/UI/Typography';

import { WalletContext } from 'contexts/Wallet';

import { S3_BUCKET_RESOURCES } from 'constants/index';

interface BalanceItemProps {
  balance: string;
  token: string;
  iconSrc: string;
  iconAlt: string;
  decimals?: number;
}

const BalanceItem = (props: BalanceItemProps) => {
  const { balance, token, iconSrc, iconAlt, decimals } = props;
  const { contractAddresses } = useContext(WalletContext);

  const upperCaseToken = token.toUpperCase();

  return (
    <Box className="flex justify-between bg-umbra lg:items-center mx-2">
      <Box className="flex items-center">
        {decimals && contractAddresses && contractAddresses[upperCaseToken] ? (
          <AddTokenButton
            options={{
              address: contractAddresses[upperCaseToken],
              symbol: token,
              decimals: decimals,
              // @ts-ignore TODO: FIX
              image: S3_BUCKET_RESOURCES[token] || iconSrc,
            }}
          />
        ) : (
          <img src={iconSrc} alt={iconAlt} className="w-6" />
        )}
        <Typography
          variant="h6"
          className="text-stieglitz font-bold my-auto ml-2"
        >
          {token}
        </Typography>
      </Box>
      <Typography variant="h6" className="text-white my-auto">
        {balance === '0' ? 0 : Number(balance).toFixed(5)}
      </Typography>
    </Box>
  );
};

export default BalanceItem;
