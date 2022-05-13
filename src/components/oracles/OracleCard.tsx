import { useState } from 'react';
import { ethers } from 'ethers';
import Box from '@mui/material/Box';
import LaunchIcon from '@mui/icons-material/Launch';

import Typography from 'components/UI/Typography';
import Dialog from 'components/UI/Dialog';
import Chart from './Chart';

// @ts-ignore TODO: FIX
const PreviousUpdatesDialog = ({ data, open, handleClose }) => {
  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Typography variant="h3" className="mb-3">
        Previous Updates
      </Typography>
      <Box className="h-96">
        {data
          .slice()
          .reverse()
          // @ts-ignore TODO: FIX
          .map((item) => {
            return (
              <Box key={item.timestamp} className="mb-4">
                <Typography variant="h5">
                  <span className="text-stieglitz">Price: </span> $ {item.price}
                </Typography>
                <Typography variant="h5">
                  <span className="text-stieglitz">Updated At: </span>
                  {new Date(item.timestamp * 1000).toUTCString()}
                </Typography>
              </Box>
            );
          })}
      </Box>
    </Dialog>
  );
};

const OracleCard = ({ data }: { data: any }) => {
  const [dialogState, setDialogState] = useState({ open: false, data: [] });

  return (
    <Box className="border border-umbra rounded p-4 flex flex-col space-y-3">
      <PreviousUpdatesDialog
        data={dialogState.data}
        open={dialogState.open}
        handleClose={() => setDialogState({ data: [], open: false })}
      />
      <Typography variant="h3" className="flex space-x-2 mb-4" component="div">
        <img src={data.imgSrc} alt={data.imgAlt} className="w-8 h-8" />
        <span>{data.tokenSymbol}</span>
      </Typography>
      <Typography variant="h5">
        <span className="text-stieglitz">Current Price: </span>$
        {ethers.utils.formatUnits(data.currentPrice, 8)}
      </Typography>
      {data?.lastUpdated ? (
        <Typography variant="h5">
          <span className="text-stieglitz">Last Updated At: </span>
          {new Date(data.lastUpdated * 1000).toUTCString()}
        </Typography>
      ) : null}
      <a href={data.contractUrl} target="_blank" rel="noopener noreferrer">
        <Typography variant="h5" className="text-stieglitz">
          Contract Explorer Link <LaunchIcon className="w-4 mb-1" />
        </Typography>
      </a>
      {data?.allData ? (
        <>
          <Typography
            variant="h5"
            className="text-wave-blue"
            role="button"
            onClick={() => {
              setDialogState({ open: true, data: data.allData });
            }}
          >
            Previous Updates
          </Typography>
          <Box className="w-100 h-32">
            <Chart data={data.allData} />
          </Box>
        </>
      ) : null}
      <Typography
        variant="h5"
        className="text-stieglitz flex justify-end"
        component="div"
      >
        Powered by <span className="capitalize ml-1">{data.type}</span>
      </Typography>
    </Box>
  );
};

export default OracleCard;
