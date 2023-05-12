import Box from '@mui/material/Box';
import { useBoundStore } from 'store';

import Typography from 'components/UI/Typography';

import smartTrim from 'utils/general/smartTrim';

import { CHAINS } from 'constants/chains';

interface ExplorerLinkProps {
  address: string;
}

const ExplorerLink = (props: ExplorerLinkProps) => {
  const { address } = props;

  const { chainId = 42161 } = useBoundStore();

  return (
    <Box className="flex">
      <a
        href={`${CHAINS[chainId]?.explorer}address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex space-x-2 bg-[#2D374B] rounded-lg p-2"
      >
        <img
          src={`/images/networks/${CHAINS[chainId]?.name.toLowerCase()}.svg`}
          alt={CHAINS[chainId]?.name}
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
