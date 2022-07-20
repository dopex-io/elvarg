import { useContext } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

import { WalletContext } from 'contexts/Wallet';

import smartTrim from 'utils/general/smartTrim';

import { CHAIN_ID_TO_NETWORK_DATA } from 'constants/index';

interface ArbiscanLinkProps {
  address: string;
}

const ExplorerLink = (props: ArbiscanLinkProps) => {
  const { address } = props;

  const { chainId = 42161 } = useContext(WalletContext);

  return (
    <Box className="flex">
      <a
        href={`https://testnet.arbiscan.io/address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex space-x-2 bg-arbitrum rounded-lg p-2"
      >
        <img
          src={CHAIN_ID_TO_NETWORK_DATA[chainId]?.icon}
          alt={CHAIN_ID_TO_NETWORK_DATA[chainId]?.name}
          className="h-[1rem] my-auto"
        />
        <Typography variant="h6" className="font-mono">
          {smartTrim(address, 10)}
        </Typography>
      </a>
    </Box>
  );
};

export default ExplorerLink;
