import React from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import AlertIcon from 'svgs/icons/AlertIcon';

const MintDisabledPanel = () => {
  return (
    <Box className="z-10 absolute top-0 flex flex-col h-[19.7rem] backdrop-blur-md text-center border rounded-xl bg-transparent border-[#F09242] p-3 space-y-2 justify-center">
      <Box className="flex w-2/3 self-center space-x-2">
        <AlertIcon className="my-auto" />
        <Typography variant="h6" className="my-auto">
          DSC Price Too Low
        </Typography>
      </Box>
      <Typography variant="caption" className="my-auto">
        Minting is only available when DSC trades above 0.985. Consider buying
        DSC on Curve.
      </Typography>
      <a
        className="text-xs text-wave-blue"
        href={'https://app.dopex.io/ssov'}
        rel="noopener noreferrer"
        target="_blank"
      >
        Learn Why
      </a>
    </Box>
  );
};

export default MintDisabledPanel;
