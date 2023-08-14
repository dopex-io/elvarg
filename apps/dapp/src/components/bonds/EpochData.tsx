import { useEffect, useMemo } from 'react';
import { BigNumber } from 'ethers';

import Box from '@mui/material/Box';

import LaunchIcon from '@mui/icons-material/Launch';

import format from 'date-fns/format';
import { useBoundStore } from 'store';

import SignerButton from 'components/common/SignerButton';
import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

type EpochData = {
  handleModal: () => void;
  handleEligibilityModal: () => void;
};

export const EpochData = ({
  handleModal,
  handleEligibilityModal,
}: EpochData) => {
  const { dpxBondsData, dpxBondsEpochData, updateBondsEpochData } =
    useBoundStore();

  const { epoch: epochNumber, epochExpiry } = dpxBondsData;
  const { depositPerNft } = dpxBondsEpochData;

  const isEpochExpired = epochExpiry < Date.now() / 1000;

  const bondsAvailable = useMemo(() => {
    if (!dpxBondsEpochData || dpxBondsEpochData.depositPerNft.eq('0')) return;

    const bondsIssued = Math.floor(
      getUserReadableAmount(dpxBondsEpochData.bondsIssued, 18)
    );

    const totalBonds = dpxBondsEpochData.maxEpochDeposits
      .div(dpxBondsEpochData.bondPrice)
      .toNumber();

    return totalBonds - bondsIssued;
  }, [dpxBondsEpochData]);

  useEffect(() => {
    updateBondsEpochData(dpxBondsData.epoch);
  }, [updateBondsEpochData, dpxBondsData.epoch]);

  return (
    <>
      <Box className="bg-cod-gray rounded-lg grid md:grid-cols-4 grid-cols-2 max-w-[728px] mb-5 mt-5">
        <Box className="p-3 flex-2 md:flex-1 border-r border-umbra">
          <Box className="text-stieglitz mb-1">Current Epoch</Box>
          <Box>{epochNumber}</Box>
        </Box>
        <Box className="p-3 md:flex-1 md:border-r border-b md:border-b-0 border-umbra">
          <Box className="text-stieglitz mb-1">Total DPX</Box>
          <Box>
            {formatAmount(
              getUserReadableAmount(
                dpxBondsEpochData.maxEpochDeposits
                  .mul(1e6)
                  .div(
                    dpxBondsEpochData.bondPrice.isZero()
                      ? BigNumber.from(1)
                      : dpxBondsEpochData.bondPrice
                  ),
                6
              ),
              2
            )}
            <span className="bg-[#C3F8FF] rounded-sm text-xs text-black font-bold p-0.5 ml-1">
              DPX
            </span>
          </Box>
        </Box>
        <Box className="p-3 md:flex-1 border-t border-r md:border-t-0 border-umbra">
          <Box className="text-stieglitz mb-1">Max USDC.e Deposit</Box>$
          {formatAmount(
            getUserReadableAmount(dpxBondsEpochData.maxEpochDeposits, 6),
            2
          )}
        </Box>
        <Box className="p-3 md:flex-1">
          <Box className="text-stieglitz mb-1">
            {isEpochExpired ? 'Expired' : 'Expiry'}
          </Box>
          {epochExpiry && format(epochExpiry * 1000, 'd MMM yyyy')}
        </Box>
      </Box>
      <Typography variant="h5">Bond with Stablecoins</Typography>
      <Box className="text-stieglitz mb-5">
        Swap your stables at a premium for vested DPX and support {"Dopex's "}
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
                  {getUserReadableAmount(depositPerNft, 6)} USDC.e per Bond
                </Typography>
                <Typography variant="h6" color="wave-blue">
                  {bondsAvailable} bonds available
                </Typography>
              </Box>
            </Box>
            <SignerButton
              variant="text"
              size="small"
              className="text-white bg-primary hover:bg-primary"
              onClick={handleModal}
            >
              Bond
            </SignerButton>
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
            Commit USDC.e upfront and receive vested DPX from treasury at a
            lower market price. Proceeds support Dopex operations.
          </Box>
        </Box>
        <Box className="p-3 w-[352px]">
          <Typography variant="h5">Eligibility</Typography>
          <Box className="text-stieglitz md:h-24 mb-5">
            Every Bridgoor NFT increases your deposit by an additional{' '}
            {getUserReadableAmount(depositPerNft, 6)} USDC.e for every epoch.
          </Box>
          <Box className="flex">
            <Box
              onClick={handleEligibilityModal}
              className="bg-mineshaft text-white test-xs p-2 rounded-md mr-5 cursor-pointer my-auto"
            >
              Check Eligibility
            </Box>
            <Box className="flex flex-col">
              <Typography variant="h6" className="my-auto">
                <a
                  className="text-wave-blue hover:underline underline-offset-1"
                  href="https://tofunft.com/collection/dopex-bridgoor/items"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  TofuNFT <LaunchIcon className="w-3" />
                </a>
              </Typography>
              <Typography variant="h6" className="my-auto mr-2">
                <a
                  className="text-wave-blue hover:underline underline-offset-1"
                  href="https://opensea.io/collection/dopex-bridgoor-nft"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Opensea <LaunchIcon className="w-3" />
                </a>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
