import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const PageLoader = () => {
  return (
    <Box className="min-h-screen flex items-center justify-items-center justify-center text-5xl flex-col bg-black">
      <CircularProgress />
    </Box>
  );
};

export default PageLoader;
