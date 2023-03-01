import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import Typography from 'components/UI/Typography';
import AlertIcon from 'svgs/icons/AlertIcon';

import { useBoundStore } from 'store';

interface Props {
  isMint: boolean;
}

const popupText: Record<string, Record<string, string>> = {
  mint: {
    title: 'DSC Price Too Low',
    description:
      'Minting is only available when DSC trades above 0.985. Consider buying DSC on Curve.',
    link: 'https://app.dopex.io/ssov',
  },
  redeem: {
    title: 'DSC Price Too High',
    description:
      'Redemptions are only available when DSC trades below 1.01. Consider selling DSC on Curve.',
    link: 'https://app.dopex.io/ssov',
  },
};

const DisabledPanel = (props: Props) => {
  const { isMint = false } = props;

  const { isLoading } = useBoundStore();

  return (
    <Box className="z-10 absolute top-0 flex flex-col h-[270px] backdrop-blur-md text-center border rounded-xl bg-transparent border-[#F09242] p-3 space-y-2 justify-center w-full">
      {!isLoading ? (
        <>
          <Box className="flex w-2/3 self-center space-x-2">
            <AlertIcon className="my-auto" />
            <Typography variant="h6" className="my-auto">
              {popupText[isMint ? 'mint' : 'redeem']?.['title']}
            </Typography>
          </Box>
          <Typography variant="caption" className="my-auto">
            {popupText[isMint ? 'mint' : 'redeem']?.['description']}
          </Typography>
          <a
            className="text-xs text-wave-blue"
            href={'https://app.dopex.io/ssov'}
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn Why
          </a>
        </>
      ) : (
        <CircularProgress size="30px" className="mx-auto" />
      )}
    </Box>
  );
};

export default DisabledPanel;
