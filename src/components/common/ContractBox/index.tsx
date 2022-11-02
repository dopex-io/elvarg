import { Box, Button } from '@mui/material';
import {
  getExtendedLogoFromChainId,
  displayAddress,
  getExplorerUrl,
} from 'utils/general';
import { Typography } from 'components/UI';

interface Props {
  chainId: number;
  contractAddress: string;
}

const ContractBox = ({ chainId, contractAddress }: Props) => {
  return (
    <Box className="border rounded border-transparent p-2">
      <Typography variant="h6" className="mb-1 text-center text-gray-400">
        Contract
      </Typography>
      <Button
        size="medium"
        color="secondary"
        className="text-white text-md h-8 w-32 p-2 hover:text-gray-200 hover:bg-slate-800 bg-slate-700"
      >
        <img
          className="w-auto h-6 mr-2"
          src={getExtendedLogoFromChainId(chainId)}
          alt={'Arbitrum'}
        />
        <a
          className={'cursor-pointer'}
          href={`${getExplorerUrl(chainId)}/address/${contractAddress}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <Typography variant="h5" className="text-white text-[11px]">
            {displayAddress(contractAddress, undefined)}
          </Typography>
        </a>
      </Button>
    </Box>
  );
};

export default ContractBox;
