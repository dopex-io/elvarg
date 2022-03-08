import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import React from 'react';

const OtcBanner = ({ bannerContent }) => {
  return (
    <Box className="bg-primary text-white rounded-lg p-3">
      <Typography variant="h6" className="py-2">
        {bannerContent.title}
      </Typography>
      <Typography variant="h6">{bannerContent.body}</Typography>
    </Box>
  );
};

export default OtcBanner;
