import AppBar from 'components/common/AppBar';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import Button from '@mui/material/Button';
import LaunchIcon from '@mui/icons-material/Launch';

import styles from './styles.module.scss';

export const BondsPage = () => {
  return (
    <>
      <AppBar />
      <Box className="mt-32 ml-300 lg:mx-6 ">
        <Typography variant="h5">Bonding</Typography>
        <Box className="text-stieglitz mb-5">
          Swap your stables at a premium for vested DPX and support Dopex’s
          operations.
        </Box>
        <Box className="bg-cod-gray rounded-lg flex w-[728px] mb-5 text/-center">
          <Box className="p-3 flex-1 border-r border-[#1E1E1E] ">
            <Box className="text-stieglitz mb-3">Epoch</Box>
            <Button className={styles['button']}>01-01-2022</Button>
          </Box>
          <Box className="p-3 flex-1 border-r border-[#1E1E1E]">
            <Box className="text-stieglitz mb-3">DPX Available</Box>
            209 / 350
          </Box>
          <Box className="p-3 flex-1 border-r border-[#1E1E1E]">
            <Box className="text-stieglitz mb-3">TBV</Box>
            $57,013
          </Box>
          <Box className="p-3 flex-1 ">
            <Box className="text-stieglitz mb-3">Unlocks</Box>
            08-01-2022
          </Box>
        </Box>
        <Typography variant="h5">Bond with Stablecoins</Typography>
        <div className="text-stieglitz mb-5">
          Swap your stables at a premium for vested DPX and support Dopex’s
          operations.
        </div>
        <Box className="flex">
          <Box className="bg-cod-gray rounded-2xl p-3 fle/x w-[352px] mr-10">
            USDC
            <div className="text-stieglitz pt-3 pb-3">
              Deposit up to 15,000 USDC
            </div>
          </Box>
          <Box className="bg-cod-gray rounded-2xl p-3 flex flex-col w-[352px]">
            Looking for other stables?
            <div className="text-stieglitz pt-3 pb-3">
              Not yet but maybe soon anon.
            </div>
          </Box>
        </Box>
        <div className="flex mt-5">
          <Box className="p-3 w-[352px] mr-10">
            <Typography variant="h5">Program Goals</Typography>
            <div className="text-stieglitz h-24  mb-5">
              Commit stablecoins upfront and receive vested DPX from treasury at
              a lower market price. Proceeds supports Dopex operations.
            </div>
            <a className="text-[#22E1FF]" href="#">
              Bonding Article <LaunchIcon className="w-4" />
            </a>
          </Box>
          <Box className="p-3 w-[352px]">
            <Typography variant="h5">Eligibility</Typography>
            <div className="text-stieglitz h-24 mb-5">
              Every Bridgoor NFT increases your cap of an additional 5000 USDC
              for every epoch.
            </div>
            <a className="text-[#22E1FF]" href="#">
              TofuNFT <LaunchIcon className="w-4" />
            </a>
          </Box>
        </div>

        <Box className="mt-5">
          <Typography variant="h5">Your Bonds</Typography>
          <Box className="border border-[#1E1E1E] rounded-2xl p-3  w-[728px] mt-5">
            Connect your wallet to see your bonds
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default BondsPage;
