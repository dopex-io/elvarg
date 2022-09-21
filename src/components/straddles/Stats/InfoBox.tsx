import { Box, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Typography from 'components/UI/Typography';

interface InfoBoxProps {
  heading: any;
  tooltip?: string;
}

const InfoBox = ({ heading, tooltip }: InfoBoxProps) => {
  return (
    <Box>
      <Box className="flex flex-row">
        <Typography variant="h6" className="text-gray-400">
          {heading}
        </Typography>
        {tooltip ? (
          <Tooltip
            placement="top"
            className="h-4 text-stieglitz"
            title={tooltip}
            arrow={true}
          >
            <InfoOutlinedIcon className="mb-3" />
          </Tooltip>
        ) : null}
      </Box>
    </Box>
  );
};

export default InfoBox;
