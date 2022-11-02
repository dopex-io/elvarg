import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { Typography } from 'components/UI';

interface InfoBoxProps {
  heading: any;
  tooltip?: string;
}

const InfoBox = ({ heading, tooltip }: InfoBoxProps) => {
  return (
    <Box>
      <Box className="flex flex-row">
        <Typography variant="h5" className="mt-2">
          {heading}
        </Typography>
        {tooltip ? (
          <Tooltip
            placement="top"
            className="h-4 text-stieglitz"
            title={tooltip}
            arrow={true}
          >
            <InfoOutlinedIcon className="mt-2" />
          </Tooltip>
        ) : null}
      </Box>
    </Box>
  );
};

export default InfoBox;
