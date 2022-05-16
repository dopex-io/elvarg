import { useCallback, useContext, useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import { LoaderIcon } from 'react-hot-toast';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import SearchIcon from '@mui/icons-material/Search';
import {
  SsovV3Viewer__factory,
  SsovV3__factory,
  ERC20__factory,
} from '@dopex-io/sdk';

import { WalletContext } from 'contexts/Wallet';
import Typography from 'components/UI/Typography';
import isZeroAddress from 'utils/contracts/isZeroAddress';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import Filter from '../Filter';

const strategies: string[] = [];
const assets: string[] = [];

interface Position {
  isSettleable: boolean;
  pnlAmount: BigNumber;
  purchasedAmount: number;
  settleableAmount: BigNumber;
  strikeIndex: number;
  strikePrice: number;
}

export default function Positions() {
  const { chainId, contractAddresses, provider } = useContext(WalletContext);
  const accountAddress = '0x161d9b5d6e3ed8d9c1d36a7caf971901c60b9222';
  const [selectedStrategies, setSelectedStrategies] = useState<
    string[] | string
  >([]);
  const [selectedAssets, setSelectedAssets] = useState<string[] | string>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updatePositions = useCallback(async () => {
    if (!provider || !accountAddress) return;

    setIsLoading(true);

    const _positions: any[] = [];
    const vaults = contractAddresses['SSOV-V3']['VAULTS'];

    const ssovViewerContract = SsovV3Viewer__factory.connect(
      contractAddresses['SSOV-V3'].VIEWER,
      provider
    );

    Object.keys(vaults).map(async (vaultName) => {
      const vaultAddress = vaults[vaultName];
      const vault = SsovV3__factory.connect(vaultAddress, provider);
      const currentEpoch = await vault.currentEpoch();
      const tokensAddresses = await ssovViewerContract.getEpochStrikeTokens(
        currentEpoch,
        vaultAddress
      );
      const epochStrikes = await vault.getEpochStrikes(currentEpoch);
      const epochData = await vault.getEpochData(currentEpoch);
      const tokenPrice = await vault.getUnderlyingPrice();
      const settlementPrice = epochData.settlementPrice;
      const isPut = await vault.isPut();
      const userEpochStrikeTokenBalanceArray = tokensAddresses.length
        ? await Promise.all(
            tokensAddresses
              .map((tokenAddress: string) => {
                const token = ERC20__factory.connect(tokenAddress, provider);
                if (isZeroAddress(token.address)) return null;
                return token.balanceOf(accountAddress);
              })
              .filter((c: any) => c)
          )
        : [];

      const userExercisableOptions = epochStrikes.map(
        (
          strike: string | number | BigNumber | BigNumber,
          strikeIndex: string | number
        ) => {
          const strikePrice = getUserReadableAmount(strike, 8);

          const purchasedAmount = getUserReadableAmount(
            userEpochStrikeTokenBalanceArray[Number(strikeIndex)] ||
              BigNumber.from(0),
            18
          );
          const settleableAmount =
            userEpochStrikeTokenBalanceArray[Number(strikeIndex)] ||
            BigNumber.from(0);
          const isSettleable =
            settleableAmount.gt(0) &&
            ((isPut && settlementPrice.lt(strike)) ||
              (!isPut && settlementPrice.gt(strike)));
          // @ts-ignore TODO: FIX
          const isPastEpoch = false;
          const pnlAmount = settlementPrice.isZero()
            ? isPut
              ? strike
                  // @ts-ignore TODO: FIX
                  .sub(tokenPrice)
                  .mul(userEpochStrikeTokenBalanceArray[Number(strikeIndex)])
                  .mul(1e10)
                  .div(ethers.utils.parseEther('1'))
              : tokenPrice
                  .sub(strike)
                  .mul(
                    userEpochStrikeTokenBalanceArray[Number(strikeIndex)] ||
                      BigNumber.from('0')
                  )
                  .div(tokenPrice)
            : isPut
            ? strike
                // @ts-ignore TODO: FIX
                .sub(settlementPrice)
                .mul(settleableAmount)
                .mul(1e10)
                .div(ethers.utils.parseEther('1'))
            : settlementPrice
                .sub(strike)
                .mul(
                  userEpochStrikeTokenBalanceArray[Number(strikeIndex)] ||
                    BigNumber.from('0')
                )
                .div(settlementPrice);

          return {
            strikeIndex,
            strikePrice,
            purchasedAmount,
            settleableAmount,
            pnlAmount,
            isSettleable,
          };
        }
      );

      _positions.push(...userExercisableOptions);
    });

    setPositions(_positions);

    setIsLoading(false);
  }, [provider, accountAddress, contractAddresses, chainId]);

  useEffect(() => {
    updatePositions();
  }, [updatePositions]);

  return (
    <Box>
      <Box className="mt-9 ml-5 mr-5">
        <Typography variant="h4">Open Positions</Typography>
        <Box className="bg-cod-gray mt-3 rounded-md text-center px-2">
          <Box className="flex py-3 px-3 border-b-[1.5px] border-umbra">
            <Box className="mr-3 mt-0.5">
              <Filter
                activeFilters={selectedStrategies}
                setActiveFilters={setSelectedStrategies}
                text={'Strategy'}
                options={strategies}
                multiple={true}
                showImages={false}
              />
            </Box>

            <Box className="mt-0.5">
              <Filter
                activeFilters={selectedAssets}
                setActiveFilters={setSelectedAssets}
                text={'Asset'}
                options={assets}
                multiple={true}
                showImages={false}
              />
            </Box>

            <Box className="ml-auto">
              <Input
                id="amount"
                name="amount"
                value=""
                type="string"
                className="bg-umbra text-mineshaft rounded-md px-3 pb-1"
                classes={{ input: 'text-right' }}
                placeholder="Type something"
                startAdornment={
                  <Box className="mr-1.5 mt-1 opacity-80 w-18">
                    <SearchIcon />
                  </Box>
                }
              />
            </Box>
          </Box>
          {isLoading ? (
            <Box>
              <LoaderIcon className="mt-3.5 ml-3.5" />
            </Box>
          ) : (
            <Box>
              <Box className="grid grid-cols-12 px-4 py-2" gap={0}>
                <Box className="col-span-2 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">Market</span>
                  </Typography>
                </Box>
                <Box className="col-span-1 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">Strike</span>
                  </Typography>
                </Box>
                <Box className="col-span-1 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">Side</span>
                  </Typography>
                </Box>
                <Box className="col-span-2 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">Amount</span>
                  </Typography>
                </Box>
                <Box className="col-span-2 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">Expiry</span>
                  </Typography>
                </Box>
                <Box className="col-span-2 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">PNL</span>
                  </Typography>
                </Box>
                <Box className="col-span-2 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">Action</span>
                  </Typography>
                </Box>
              </Box>
              {positions.map((key, i) => (
                <Box
                  key={i}
                  className="grid grid-cols-12 px-4 pt-2 pb-4"
                  gap={0}
                >
                  <Box className="col-span-2 text-left flex">
                    <img src={`/assets/dpx.svg`} className="w-8 h-8 mr-2" />
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">DPX</span>
                    </Typography>
                  </Box>
                  <Box className="col-span-1 text-left">
                    <Typography variant="h6" className="mt-2">
                      <span className="text-white bg-umbra rounded-md px-2 py-1">
                        $2500
                      </span>
                    </Typography>
                  </Box>
                  <Box className="col-span-1 text-left">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">Calls</span>
                    </Typography>
                  </Box>
                  <Box className="col-span-2 text-left">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">12.5</span>
                    </Typography>
                  </Box>
                  <Box className="col-span-2 text-left">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">21 DEC 2021</span>
                    </Typography>
                  </Box>
                  <Box className="col-span-2 text-left">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-[#6DFFB9]">41%</span>
                    </Typography>
                  </Box>
                  <Box className="col-span-2 text-left">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-stieglitz"></span>
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          <Box></Box>
        </Box>
      </Box>
    </Box>
  );
}
