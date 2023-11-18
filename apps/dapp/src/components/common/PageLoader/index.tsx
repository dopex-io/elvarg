import CircularProgress from '@mui/material/CircularProgress';

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-items-center justify-center text-5xl flex-col bg-black">
      <img
        src="/images/misc/loading.gif"
        alt="dopex-loading"
        className="w-24"
      />
    </div>
  );
};

export default PageLoader;
