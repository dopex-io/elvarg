import Box from '@mui/material/Box';

const Chip = ({ text }: { text: string }) => {
  return (
    <Box className="bg-mineshaft text-xs p-1 rounded text-stieglitz">
      {text}
    </Box>
  );
};

export default Chip;
