import { useContext } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import AlarmIcon from 'svgs/icons/AlarmIcon';

import { WalletContext } from 'contexts/Wallet';

import smartTrim from 'utils/general/smartTrim';

import { CHAIN_ID_TO_NETWORK_DATA } from 'constants/index';

interface ContractDataProps {
  epoch: number;
  fundingRate: number;
  contractAddress: string;
  poolType: string;
}

const ContractData = (props: ContractDataProps) => {
  const { epoch, fundingRate, contractAddress, poolType } = props;

  const { chainId } = useContext(WalletContext);

  return (
    <Box className="flex p-3 border border-umbra rounded-xl w-full space-x-8">
      <Box className="space-y-1">
        <Typography variant="h6" className="text-stieglitz">
          Epoch
        </Typography>
        <Box className="flex space-x-2">
          <Typography
            variant="h6"
            className="bg-gradient-to-r from-primary to-wave-blue rounded-lg w-[2rem] py-2 text-center font-semibold my-auto"
          >
            {epoch}
          </Typography>
          <Box className="flex space-x-3 p-2 rounded-lg bg-umbra">
            <AlarmIcon fill="#8E8E8E" />
            <Typography variant="h6" className="my-auto font-semibold">
              DD HH mm
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="space-y-1">
        <Typography variant="h6" className="text-stieglitz">
          Funding Rate
        </Typography>
        <Box className="flex">
          <Typography
            variant="h6"
            className="font-semibold p-2 bg-umbra rounded-lg"
          >
            {fundingRate}%
          </Typography>
        </Box>
      </Box>
      <Box className="space-y-1">
        <Typography variant="h6" className="text-stieglitz">
          Contract
        </Typography>
        <Box role="button" className="flex space-x-2 bg-umbra rounded-lg p-2">
          <img
            // @ts-ignore TODO: FIX
            src={CHAIN_ID_TO_NETWORK_DATA[chainId].icon}
            // @ts-ignore TODO: FIX
            alt={CHAIN_ID_TO_NETWORK_DATA[chainId].name}
            style={{ width: 'auto', height: 'auto' }}
          />
          <Typography variant="h6" className="font-mono">
            {smartTrim(contractAddress, 10)}
          </Typography>
        </Box>
      </Box>
      <Box className="space-y-1">
        <Typography variant="h6" className="text-stieglitz">
          Strategy
        </Typography>
        <Typography
          variant="h6"
          className="flex space-x-2 bg-umbra rounded-lg p-2"
        >
          {poolType[0]?.toUpperCase() + poolType.substring(1)}
        </Typography>
      </Box>
    </Box>
  );
};

export default ContractData;
