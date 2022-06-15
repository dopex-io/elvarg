import { createContext, useState, useContext, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import LaunchIcon from '@mui/icons-material/Launch';
import LinearProgress from '@mui/material/LinearProgress';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import Input from 'components/UI/Input';

export interface ModalBondsProps {
  modalOpen: boolean;
  handleModal: () => void;
}

const BondsInfo = ({ title, value }: { title: string; value: string }) => {
  return (
    <Box className="flex mb-3">
      <Typography
        variant="caption"
        className="text-xs text-stieglitz ml-0 mr-auto flex"
      >
        {title}
      </Typography>
      <Box className="text-right">
        <Typography variant="caption" className="text-white mr-auto ml-0 flex">
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export const ModalBonds = ({ modalOpen, handleModal }: ModalBondsProps) => {
  const [err, setErr] = useState(false);

  return (
    <Dialog
      PaperProps={{ style: { backgroundColor: 'transparent' } }}
      open={modalOpen}
      onClose={handleModal}
    >
      <Box className="bg-cod-gray rounded-2xl p-4  md:w-[343px] ">
        <Box className="flex mb-3">
          <Typography className="flex-1 pt-2" variant="h5">
            Bond
          </Typography>
          <Box className="bg-mineshaft text-white test-xs p-2 rounded-md mr-3">
            Bridgoor x 2
          </Box>
          <CloseIcon
            className="fill-current text-white mt-3"
            onClick={handleModal}
          />
        </Box>
        <Input
          leftElement={
            <Box className="mr-2 flex space-x-2">
              <img
                src="/images/tokens/usdc.svg"
                alt="usdc"
                className="w-8 h-8"
              />
              <CustomButton
                size="small"
                color="secondary"
                className="bg-mineshaft px-5 min-w-0 text-xs"
                // onClick={handleMax}
              >
                MAX
              </CustomButton>
            </Box>
          }
          bottomElement={
            <div className="flex">
              <Typography
                className="flex-1"
                variant="caption"
                color="stieglitz"
              >
                Balance:
              </Typography>
              <Typography variant="caption" color="white">
                21000 USDC
              </Typography>
            </div>
          }
          placeholder="0.0"
        />
        {err && (
          <Box className="bg-[#FF617D] rounded-2xl mt-3 p-2">
            <AccessibleForwardIcon /> Something went wrong
          </Box>
        )}

        <Box className="flex mt-3">
          <Box className="flex-1 bg-cod-gray  border border-[#1E1E1E] p-2">
            <Typography variant="caption" className="text-white  pt-3">
              -
            </Typography>
            <Box className="text-stieglitz pb-3 justify-between items-center">
              To DPX
            </Box>
          </Box>
          <Box className="flex-1  bg-cod-gray  border border-[#1E1E1E] p-2">
            <Typography variant="caption" className="text-white  pt-3">
              -
            </Typography>
            <Box className="text-stieglitz">Discount</Box>
          </Box>
        </Box>
        <Box className="border border-[#1E1E1E] p-3">
          <BondsInfo title="Bonding Price" value="410 USDC" />
          <BondsInfo title="Oracle Price" value="416 USDC" />
          <BondsInfo title="Vesting Term" value="1 Week" />
          <BondsInfo title="Total Bonding Limit" value="45134.11 / 85000" />
          <LinearProgress variant="determinate" value={25} />
        </Box>
        <Box className="bg-umbra p-4 rounded-xl mt-3">
          <Box className="flex mb-2">
            <Typography
              variant="caption"
              className=" text-xs text-stieglitz ml-0 mr-auto flex"
            >
              <img
                src="/assets/gasicon.svg"
                className="mr-2 h-[0.8rem]"
                alt="Gas"
              />
              Est. Gas Cost
            </Typography>
            <Box>
              <Typography
                variant="caption"
                className="text-xs text-white mr-auto ml-0 flex"
              >
                <span className="opacity-70 mr-2">~$5</span>
                0.003 ETH
              </Typography>
            </Box>
          </Box>
          <Box className="flex mb-2">
            <Typography
              variant="caption"
              className="text-stieglitz mr-auto flex"
            >
              Contract <LaunchIcon className="w-3 ml-1 pb-2" />
            </Typography>
            <Box className="text-xs text-white"> 0x134 </Box>
          </Box>
          <Box className="flex">
            <Typography
              variant="caption"
              className=" text-xs text-stieglitz mr-auto flex"
            >
              Wallet Limit <HelpOutlineIcon className="w-3 ml-1 pb-2" />
            </Typography>
            <Box className="text-[#22E1FF] text-xs">15000</Box>
          </Box>
        </Box>
        <CustomButton
          variant="text"
          size="small"
          color="umbra"
          className="text-white bg-primary hover:bg-primary w-full mt-5  p-4"
          disabled
        >
          Select Amount
        </CustomButton>
      </Box>
    </Dialog>
  );
};
