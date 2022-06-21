import { useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import Button from '@mui/material/Button';
import LaunchIcon from '@mui/icons-material/Launch';
import CustomButton from 'components/UI/CustomButton';
import { DpxBondsContext } from 'contexts/Bonds';
import format from 'date-fns/format';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import styles from './styles.module.scss';

type EpochData = {
  accountAddress: string | undefined;
  handleModal: () => void;
};

export const EpochData = ({ accountAddress, handleModal }: EpochData) => {
  const {
    epochNumber,
    epochExpiry,
    maxDepositsPerEpoch,
    totalEpochDeposits,
    dpxPrice,
    bondsDpx,
  } = useContext(DpxBondsContext);

  return (
    <>
      <Box className="bg-cod-gray rounded-lg flex flex-wrap md:w-[728px] mb-5 mt-5">
        <Box className="p-3 flex-2 md:flex-1 border-r border-[#1E1E1E] w-2/4">
          <Box className="text-stieglitz mb-3">Epoch</Box>
          <Button className={`${styles['button']}`}>{epochNumber}</Button>
        </Box>
        <Box className="p-3 md:flex-1 md:border-r border-b md:border-b-0 border-[#1E1E1E] w-2/4">
          <Box className="text-stieglitz mb-3">DPX Available</Box>
          <Box>
            {getUserReadableAmount(bondsDpx) - totalEpochDeposits / dpxPrice} /{' '}
            {getUserReadableAmount(bondsDpx)}
            <span className="bg-[#C3F8FF] rounded-sm text-xs text-black font-bold  p-0.5 ml-1">
              DPX
            </span>
          </Box>
        </Box>
        <Box className="p-3 md:flex-1 border-t border-r md:border-t-0 border-[#1E1E1E] w-2/4">
          <Box className="text-stieglitz mb-3">TBV</Box>$
          {getUserReadableAmount(totalEpochDeposits, 6)}
        </Box>
        <Box className="p-3 md:flex-1">
          <Box className="text-stieglitz mb-3">Expiry</Box>
          {epochExpiry && format(epochExpiry, 'MM/dd/yyyy')}
        </Box>
      </Box>
      <Typography variant="h5">Bond with Stablecoins</Typography>
      <Box className="text-stieglitz mb-5">
        Swap your stables at a premium for vested DPX and support Dopexs
        operations.
      </Box>
      <Box className="md:flex">
        <Box className="bg-cod-gray rounded-2xl p-3 w-[352px] mb-5 md:mb-0 md:mr-5">
          <Box className="flex pt-3 pb-3 items-center">
            <img
              src={'/images/tokens/usdc.svg'}
              alt={'usdc'}
              className="w-[40px] mr-3"
            />
            <Box className="flex-1">
              USDC <br />
              <span className="flex-1 text-stieglitz text-xs">
                Deposit up to{' '}
                {getUserReadableAmount(maxDepositsPerEpoch, 6) -
                  getUserReadableAmount(totalEpochDeposits, 6)}{' '}
                USDC
              </span>
            </Box>
            <CustomButton
              variant="text"
              size="small"
              className="text-white bg-primary hover:bg-primary ml-10"
              onClick={handleModal}
            >
              {accountAddress ? 'Bond' : 'Connect'}
            </CustomButton>
          </Box>
        </Box>
        <Box className="bg-cod-gray rounded-2xl p-3 w-[352px]">
          <div className="flex pt-3 flex items-center">
            <img
              src={'/images/tokens/stables-group.svg'}
              alt={'usdc'}
              className="w-[50px] mr-3 grayscale"
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
      <div className="md:flex mt-5">
        <Box className="p-3 w-[352px] mr-10">
          <Typography variant="h5">Program Goals</Typography>
          <div className="text-stieglitz h-24  mb-7">
            Commit stablecoins upfront and receive vested DPX from treasury at a
            lower market price. Proceeds supports Dopex operations.
          </div>
          <a className="text-[#22E1FF]" href="#">
            Bonding Article <LaunchIcon className="w-4" />
          </a>
        </Box>
        <Box className="p-3 w-[352px]">
          <Typography variant="h5">Eligibility</Typography>
          <div className="text-stieglitz md:h-24 mb-5">
            Every Bridgoor NFT increases your cap of an additional 5000 USDC for
            every epoch.
          </div>
          <Box className="flex">
            <Box className="bg-mineshaft text-white test-xs p-2 rounded-md mr-5">
              Check Eligibility
            </Box>
            <a
              className="text-[#22E1FF] mt-2 "
              href="https://tofunft.com/collection/dopex-bridgoor/items"
            >
              TofuNFT <LaunchIcon className="w-4" />
            </a>
          </Box>
        </Box>
      </div>
    </>
  );
};
