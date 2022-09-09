/** @jsxImportSource @emotion/react */
import { useContext, useCallback, useMemo } from 'react';
import { css } from '@emotion/react';
import Box from '@mui/material/Box';
import LaunchIcon from '@mui/icons-material/Launch';
import format from 'date-fns/format';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';

import { DpxBondsContext } from 'contexts/Bonds';
import { WalletContext } from 'contexts/Wallet';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

type EpochData = {
  accountAddress: string | undefined;
  handleModal: () => void;
  handleEligibilityModal: () => void;
};

export const EpochData = ({
  accountAddress,
  handleModal,
  handleEligibilityModal,
}: EpochData) => {
  const { dpxBondsData, dpxBondsEpochData } = useContext(DpxBondsContext);
  const { connect } = useContext(WalletContext);

  const {
    epoch: epochNumber,
    epochExpiry,
    dpxPrice,
    maxDepositsPerEpoch,
  } = dpxBondsData;
  const { bondsIssued, totalEpochDeposits, depositPerNft } = dpxBondsEpochData;

  const handleWalletConnect = useCallback(() => {
    connect && connect();
  }, [connect]);

  const availableDpx = useMemo(() => {
    if (totalEpochDeposits.eq(0) || dpxPrice.eq(0)) return 0;

    return Math.abs(
      getUserReadableAmount(bondsIssued.sub(totalEpochDeposits.div(dpxPrice)))
    );
  }, [bondsIssued, dpxPrice, totalEpochDeposits]);

  const isEpochExpired = epochExpiry < Date.now() / 1000;

  return (
    <>
      <Box className="bg-cod-gray rounded-lg flex flex-wrap max-w-[728px] mb-5 mt-5">
        <Box className="p-3 flex-2 md:flex-1 border-r border-umbra w-2/4">
          <Box className="text-stieglitz mb-3">Epoch</Box>
          <Box
            css={css`
              background: linear-gradient(
                318.43deg,
                #002eff -7.57%,
                #22e1ff 100%
              );
              border-radius: 5px;
              color: white;
              width: 70px;
              padding: 8px;
              text-align: center;
              cursor: not-allowed;
            `}
          >
            {epochNumber}
          </Box>
        </Box>
        <Box className="p-3 md:flex-1 md:border-r border-b md:border-b-0 border-umbra w-2/4">
          <Box className="text-stieglitz mb-3">DPX Available</Box>
          <Box>
            {availableDpx.toFixed()} / {getUserReadableAmount(bondsIssued)}
            <span className="bg-[#C3F8FF] rounded-sm text-xs text-black font-bold  p-0.5 ml-1">
              DPX
            </span>
          </Box>
        </Box>
        <Box className="p-3 md:flex-1 border-t border-r md:border-t-0 border-umbra w-2/4">
          <Box className="text-stieglitz mb-3">Deposit Cap</Box>$
          {getUserReadableAmount(totalEpochDeposits, 6)}
        </Box>
        <Box className="p-3 md:flex-1">
          <Box className="text-stieglitz mb-3">
            {isEpochExpired ? 'Expired' : 'Expiry'}
          </Box>
          {epochExpiry && format(epochExpiry * 1000, 'd MMM yyyy')}
        </Box>
      </Box>
      <Typography variant="h5">Bond with Stablecoins</Typography>
      <Box className="text-stieglitz mb-5">
        Swap your stables at a premium for vested DPX and support Dopexs
        operations.
      </Box>
      <Box className="lg:flex">
        <Box className="bg-cod-gray rounded-2xl p-2 w-[352px] mb-5 lg:mb-0 md:mr-5">
          <Box className="flex pt-3 pb-3 items-center justify-between">
            <Box className="flex">
              <img
                src={'/images/tokens/usdc.svg'}
                alt={'usdc'}
                className="w-[40px] mr-3"
              />
              <Box className="flex flex-col">
                <Typography variant="h5" color="white">
                  USDC
                </Typography>
                <Typography variant="h6" color="stieglitz">
                  Deposit up to{' '}
                  {formatAmount(
                    getUserReadableAmount(maxDepositsPerEpoch, 6) -
                      getUserReadableAmount(totalEpochDeposits, 6),
                    0,
                    true
                  )}{' '}
                  USDC
                </Typography>
              </Box>
            </Box>
            <CustomButton
              variant="text"
              size="small"
              className="text-white bg-primary hover:bg-primary"
              onClick={accountAddress ? handleModal : handleWalletConnect}
            >
              {accountAddress ? 'Bond' : 'Connect'}
            </CustomButton>
          </Box>
        </Box>
        <Box className="flex justify-between bg-cod-gray rounded-2xl p-2 w-[352px]">
          <Box className="flex items-center">
            <img
              src={'/images/tokens/stables-group.svg'}
              alt={'usdc'}
              className="w-[50px] mr-3 grayscale"
            />
            <Box>
              Looking for other stables?
              <Typography variant="h6" color="stieglitz" className="flex-1">
                Not yet but maybe soon anon.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="lg:flex mt-5">
        <Box className="p-3 w-[352px] mr-5">
          <Typography variant="h5">Program Goals</Typography>
          <Box className="text-stieglitz h-24  mb-7">
            Commit stablecoins upfront and receive vested DPX from treasury at a
            lower market price. Proceeds supports Dopex operations.
          </Box>
          <a className="text-[#22E1FF]" href="#">
            Bonding Article <LaunchIcon className="w-4" />
          </a>
        </Box>
        <Box className="p-3 w-[352px]">
          <Typography variant="h5">Eligibility</Typography>
          <Box className="text-stieglitz md:h-24 mb-5">
            Every Bridgoor NFT increases your cap by an additional{' '}
            {getUserReadableAmount(depositPerNft, 6)} USDC for every epoch.
          </Box>
          <Box className="flex">
            <Box
              onClick={handleEligibilityModal}
              className="bg-mineshaft text-white test-xs p-2 rounded-md mr-5 cursor-pointer"
            >
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
      </Box>
    </>
  );
};
