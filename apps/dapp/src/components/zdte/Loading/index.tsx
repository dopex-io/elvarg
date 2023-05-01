import { CircularProgress } from '@mui/material';

const Loading = () => {
  return (
    <div className="absolute left-[49%] top-[49%]">
      <CircularProgress />
    </div>
  );
};

export default Loading;
