import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

const PageLoader = () => {
  return (
    <Box className="min-h-screen flex items-center justify-items-center justify-center text-5xl flex-col bg-black">
      <CircularProgress />
    </Box>
  );
};

export default PageLoader;
