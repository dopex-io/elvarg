import { Box } from '@mui/material';
import Typography from 'components/UI/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface Props {
  title: string;
  paragraph: string;
}

const EmergencyNoticeBanner = ({ title, paragraph }: Props) => {
  return (
    <Box className="xl:max-w-6xl lg:max-w-4xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto mt-32 mb-10 lg:mb-4">
      <Box className="flex flex-col bg-red-600 rounded-lg mx-6 py-4 px-6 lg:h-20 lg:flex-row sm:items-center h-full">
        <Box className="md:w-full self-start">
          <Typography variant="h4" className="text-white">
            {title} <InfoOutlinedIcon className="h-5" />
          </Typography>
          <span className="font-thin text-white">{paragraph}</span>
        </Box>
      </Box>
    </Box>
  );
};

export default EmergencyNoticeBanner;
