import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

import { useBoundStore } from 'store';

import smartTrim from 'utils/general/smartTrim';

import {
  CHAIN_ID_TO_NETWORK_DATA,
  CHAIN_ID_TO_EXPLORER,
} from 'constants/index';

interface ArbiscanLinkProps {
  address: string;
}

const ExplorerLink = (props: ArbiscanLinkProps) => {
  const { address } = props;

  const { chainId = 42161 } = useBoundStore();

  return (
    <Box className="flex">
      <a
        href={`${CHAIN_ID_TO_EXPLORER[chainId]}address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex space-x-2 bg-[#2D374B] rounded-lg p-2"
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
