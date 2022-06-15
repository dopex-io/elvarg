import { useContext, useState } from 'react';
import AppBar from 'components/common/AppBar';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import Button from '@mui/material/Button';
import LaunchIcon from '@mui/icons-material/Launch';
import CustomButton from 'components/UI/CustomButton';

import { WalletContext } from 'contexts/Wallet';
import styles from './styles.module.scss';
import { UserBonds } from 'components/bonds/UserBonds';
import { ModalBonds } from 'components/bonds//ModalBonds';

export const BondsPage = () => {
  const { accountAddress } = useContext(WalletContext);
  const [modalOpen, setModal] = useState(false);

  const handleModal = () => {
    setModal(!modalOpen);
  };

  return (
    <>
      <AppBar />
      <Box className="mt-32 ml-300 lg:mx-6 ">
        <Typography variant="h5">Bonding</Typography>
        <Box className="text-stieglitz mb-5">
          Swap your stables at a premium for vested DPX and support Dopex’s
          operations.
        </Box>
        <Box className="bg-cod-gray rounded-lg flex w-[728px] mb-5">
          <Box className="p-3 flex-1 border-r border-[#1E1E1E] ">
            <Box className="text-stieglitz mb-3">Epoch</Box>
            {/* @ts-ignore TODO: FIX */}
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
          <Box className="bg-cod-gray rounded-2xl p-3 w-[352px] mr-10">
            <div className="flex pt-3 pb-3 items-center">
              <img
                src={'/images/tokens/usdc.svg'}
                alt={'usdc'}
                className="w-[40px] mr-3"
              />
              <div className="flex-1">
                USDC <br />
                <span className="flex-1 text-stieglitz text-xs">
                  Deposit up to 15,000 USDC
                </span>
              </div>

              <CustomButton
                variant="text"
                size="small"
                className="text-white bg-primary hover:bg-primary ml-10"
                onClick={handleModal}
              >
                {accountAddress ? 'Bond' : 'Connect'}
              </CustomButton>
            </div>
          </Box>
          <Box className="bg-cod-gray rounded-2xl p-3 w-[352px]">
            <div className="flex pt-3 flex items-center">
              <img
                src={'/images/tokens/stables-group.svg'}
                alt={'usdc'}
                className="w-[50px] mr-3"
              />
              <div className="flex-1">
                Looking for other stables? <br />
                <span className="text-stieglitz text-xs">
                  Not yet but maybe soon anon.
                </span>
              </div>
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
        <UserBonds accountAddress={accountAddress} handleModal={handleModal} />
      </Box>
      <ModalBonds modalOpen={modalOpen} handleModal={handleModal} />
    </>
  );
};

export default BondsPage;
