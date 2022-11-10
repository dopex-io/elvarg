import Box from '@mui/material/Box';
import SubdirectoryArrowRightRoundedIcon from '@mui/icons-material/SubdirectoryArrowRightRounded';

import Typography from 'components/UI/Typography';

interface TokenOutPanelProps {
  tokenSymbol: string;
  amountWithFee: string;
}

const TokenOutPanel = (props: TokenOutPanelProps) => {
  const { tokenSymbol, amountWithFee } = props;

  return (
    <Box className="flex bg-umbra p-3 rounded-xl justify-between">
      <Box className="flex space-x-1">
        <SubdirectoryArrowRightRoundedIcon className="fill-current text-stieglitz p-0 h-5 my-auto" />
        <Typography variant="h6" color="stieglitz">
          Receive (Incl. Fees)
        </Typography>
      </Box>
      <Box className="flex space-x-1">
        <Typography variant="h6">&#x2248; {amountWithFee}</Typography>
        <img
          src={`/images/tokens/${tokenSymbol.toLowerCase()}.svg`}
          alt={tokenSymbol.toUpperCase()}
          className="w-4 h-4 my-auto"
        />
      </Box>
    </Box>
  );
};

export default TokenOutPanel;
