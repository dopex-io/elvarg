import React from 'react';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import ZapIcon from 'svgs/icons/ZapIcon';

const DepositBuyCard = () => {
  return (
    <Box className="bg-umbra rounded-xl p-3 max-w-md">
      <Box className="mb-4">
        <Typography variant="h6">Deposit</Typography>
      </Box>
      <Box className="rounded-lg bg-neutral-800">
        <Box className="flex items-center">
          <Box className="mx-4 p-1 bg-umbra w-fit rounded-full flex items-center">
            <img
              className="w-6 h-6"
              src="/images/tokens/usdc.svg"
              alt={'usdc icon'}
            />
            <Typography variant="h6" className="mx-2">
              USDC
            </Typography>
          </Box>
          <Box className=" bg-neutral-600 w-fit h-fit rounded-md">
            <Typography variant="h6" className="mx-2 py-1 text-gray-400">
              MAX
            </Typography>
          </Box>
          <Typography variant="h6" className="m-4 text-gray-400 ml-auto">
            0.0
          </Typography>
        </Box>
        <Box className="flex items-center mx-4 pb-2">
          <Typography variant="h6" className=" text-gray-400">
            Balance
          </Typography>
          <Typography variant="h6" className=" text-white ml-auto mr-2">
            100
          </Typography>
          <Typography variant="h6" className=" text-white">
            WETH
          </Typography>
        </Box>
      </Box>
      <Box className="mt-4 flex justify-center">
        <Box className="py-2 w-full rounded-tl-lg border border-neutral-700">
          <Typography variant="h6" className="mx-2 text-gray-400">
            -
          </Typography>
          <Typography variant="h6" className="mx-2 text-gray-400">
            Deposit
          </Typography>
        </Box>
        <Box className="py-2 w-full rounded-tr-lg border border-neutral-700">
          <Typography variant="h6" className="mx-2 text-gray-400">
            -
          </Typography>
          <Typography variant="h6" className="mx-2 text-gray-400">
            Vault Share
          </Typography>
        </Box>
      </Box>
      <Box className="py-2 w-full flex justify-between rounded-b-lg border border-t-0 border-neutral-700">
        <Box className="">
          <Typography variant="h6" className="mx-2 text-gray-400">
            Next Epoch
          </Typography>
          <Typography variant="h6" className="mx-2 text-gray-400">
            Withdrawable
          </Typography>
        </Box>
        <Box className="">
          <Typography variant="h6" className="mx-2 text-white">
            24 Jun 2022
          </Typography>
          <Typography variant="h6" className="mx-2 text-white">
            27 Jun 2022
          </Typography>
        </Box>
      </Box>
      <Box className="my-4 w-full rounded-lg border border-neutral-700">
        <Box className="flex justify-start items-center mx-2">
          <ZapIcon className="w-4 h-4" />
          <Typography variant="h6" className="mx-2 py-2">
            Auto Rollover Configured
          </Typography>
        </Box>
        <Typography variant="h6" className="mx-2 pb-2 text-gray-400">
          This vault roll deposits over between epochs. This can be cancelled
          after depositing.
        </Typography>
      </Box>
      <Box className="rounded-lg bg-neutral-800">
        <Box className="p-3">
          <Box className="bg-neutral-700 rounded-md flex items-center p-2 mb-3">
            <img
              className="w-3 h-3"
              src="/images/tokens/usdc.svg"
              alt={'usdc icon'}
            />
            <Typography variant="h6" className="ml-2 text-gray-400">
              Est. Gas Cost
            </Typography>
            <Box className="flex justify-between ml-auto">
              <Typography variant="h6" className="mx-1 text-gray-400">
                ~ $6,2
              </Typography>
              <Typography variant="h6" className="mx-1">
                0.003 ETH
              </Typography>
            </Box>
          </Box>
          <Box className="bg-neutral-600 rounded-md flex items-center p-2 mb-3">
            <img
              className="w-3 h-3"
              src="/images/tokens/usdc.svg"
              alt={'usdc icon'}
            />
            <Typography variant="h6" className="mx-2">
              Get 2CRV
            </Typography>
          </Box>
          <Box className="bg-neutral-600 rounded-md flex items-center p-2">
            <img
              className="w-3 h-3"
              src="/images/tokens/usdc.svg"
              alt={'usdc icon'}
            />
            <Typography variant="h6" className="mx-2">
              Payout Calculator
            </Typography>
          </Box>
          <Box className="">
            <ZapIcon className="w-4 h-4" />
            <Box className="mx-2">
              <Typography variant="h6" className="text-gray-400">
                Withdrawals are locked until end of Epoch 4
              </Typography>
              <Typography variant="h6" className="">
                20 December
              </Typography>
            </Box>
          </Box>
          <Box className="bg-neutral-700 rounded-md flex justify-center items-center p-2 mt-4">
            <Typography variant="h6" className="text-gray-400">
              Deposit
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DepositBuyCard;
