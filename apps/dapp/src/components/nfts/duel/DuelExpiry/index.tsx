import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';

const DuelExpiry = ({ text }: { text: string }) => {
  return (
    <Box className="flex mb-1.5">
      <Box className="flex text-center p-2 mr-2 mt-1">
        <img
          src="/images/misc/clock.svg"
          className="w-7 h-5 mt-1"
          alt="Clock"
        />
      </Box>
      <Typography variant="h6" className="mt-1">
        <span className="text-[#78859E]">{text}</span>
      </Typography>
    </Box>
  );
};

export default DuelExpiry;
