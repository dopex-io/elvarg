import { useState } from 'react';
import Box from '@mui/material/Box';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';

import Typography from 'components/UI/Typography';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import CustomButton from 'components/UI/Button';
import DisabledPanel from 'components/rdpx-v2/BondPanel/DisabledPanel';

import { useBoundStore } from 'store';

const Mint = () => {
  const [redeemDisabled, _] = useState<boolean>(true);
  const { chainId } = useBoundStore();

  return (
    <Box className="space-y-3 relative">
      {redeemDisabled ? <DisabledPanel isMint={false} /> : null}
      <Box className="bg-umbra rounded-xl w-full h-[19.8rem]"></Box>
      <Box className="rounded-xl p-4 w-full bg-umbra">
        <Box className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800 space-y-2">
          <EstimatedGasCostButton gas={500000} chainId={chainId} />
          <Box className="flex justify-between">
            <Typography variant="h6" color="stieglitz">
              Receive
            </Typography>
            <Box className="flex my-auto space-x-2">
              <Typography variant="h6" color="stieglitz">
                {'-'}
              </Typography>
              <img
                src={`/images/tokens/${'DSC'?.toLowerCase()}.svg`}
                alt={'USDC'.toLowerCase()}
                className="w-[1rem] my-auto"
              />
            </Box>
          </Box>
        </Box>
        {!redeemDisabled ? (
          <CustomButton
            size="medium"
            className="w-full mt-4 rounded-md"
            color={'mineshaft'}
            disabled={redeemDisabled || true}
            onClick={() => {}}
          >
            Redeem
          </CustomButton>
        ) : (
          <a
            className="flex space-x-2 w-full mt-4 rounded-md bg-[#3966A0] justify-between p-2"
            role="link"
            href="https://arbitrum.curve.fi/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="flex space-x-2">
              <img
                src={'/images/tokens/crv.svg'}
                alt="crv"
                className="w-4 my-auto"
              />
              <Typography variant="h6">Sell DSC</Typography>
            </span>
            <LaunchOutlinedIcon className="fill-current text-white w-[1.1rem]" />
          </a>
        )}
      </Box>
    </Box>
  );
};

export default Mint;
