import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import { ReactNode } from 'react';
interface BannerProps {
  title: string;
  body: string;
  bottomElement: ReactNode;
}

const OtcBanner = (props: BannerProps) => {
  const { title, body, bottomElement } = props;
  return (
    <Box className="bg-primary text-white rounded-lg p-3 flex flex-col space-y-2">
      <Typography variant="h6" className="py-2">
        {title}
      </Typography>
      <Typography variant="h6">{body}</Typography>
      {bottomElement}
    </Box>
  );
};

export default OtcBanner;
