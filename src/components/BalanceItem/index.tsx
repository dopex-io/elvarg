import { useContext } from 'react';
import Box from '@material-ui/core/Box';

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
    <Box className="flex lg:flex-row flex-col bg-umbra rounded-xl px-4 py-3 lg:items-center">
      <Box className="mr-3 h-8 flex flex-row items-center mb-2 lg:mb-0">
        <img src={iconSrc} alt={iconAlt} className="mr-3" />
        <Typography variant="h5" className="text-stieglitz font-bold mr-3">
          {token}
        </Typography>
        {decimals && contractAddresses && contractAddresses[upperCaseToken] && (
          <AddTokenButton
            options={{
              address: contractAddresses[upperCaseToken],
              symbol: token,
              decimals: decimals,
              image: S3_BUCKET_RESOURCES[upperCaseToken],
            }}
          />
        )}
      </Box>
      <Typography
        variant="h5"
        className="text-white mb-1 text-left lg:text-right w-full ml-1 lg:ml-0"
      >
        {balance}
      </Typography>
    </Box>
  );
};

export default BalanceItem;
