import { Box, Tooltip } from '@mui/material';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import Typography from 'components/UI/Typography';

interface InfoBoxProps {
  heading: any;
  tooltip?: string;
}

const InfoBox = ({ heading, tooltip }: InfoBoxProps) => {
  return (
    <Box className="flex">
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
          <InfoOutlinedIcon className="fill-current text-stieglitz my-auto" />
        </Tooltip>
      ) : null}
    </Box>
  );
};

export default InfoBox;
