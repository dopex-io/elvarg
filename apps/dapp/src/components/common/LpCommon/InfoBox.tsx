import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { Typography } from 'components/UI';

interface InfoBoxProps {
  heading: any;
  tooltip?: string;
}

const InfoBox = ({ heading, tooltip }: InfoBoxProps) => {
  return (
    <Box>
      <Box className="flex flex-row">
        <Typography variant="h6" color="stieglitz">
          {heading}
        </Typography>
        {tooltip ? (
          <Tooltip
            placement="top"
            className="h-4 text-stieglitz"
            title={tooltip}
            arrow={true}
          >
            <HelpOutlineIcon fontSize="small" />
          </Tooltip>
        ) : null}
      </Box>
    </Box>
  );
};

export default InfoBox;
