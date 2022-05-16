import { useCallback, useContext, useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import Link from 'next/link';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import format from 'date-fns/format';
import useSendTx from 'hooks/useSendTx';
import {
  SsovV3Viewer__factory,
  SsovV3__factory,
  ERC20__factory,
} from '@dopex-io/sdk';

import { WalletContext } from 'contexts/Wallet';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import isZeroAddress from 'utils/contracts/isZeroAddress';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import formatAmount from 'utils/general/formatAmount';
import getAssetFromVaultName from 'utils/contracts/getAssetFromVaultName';

import Filter from '../Filter';

const strategies: string[] = [];
const assets: string[] = [];

interface Position {
  isSettleable: boolean;
  pnlAmount: number;
  purchasedAmount: number;
  settleableAmount: BigNumber;
  strikeIndex: number;
  strikePrice: number;
  vaultName: string;
  imgSrc: string;
  isPut: boolean;
  epochEndTime: Date;
  currentEpoch: number;
}

export default function Positions() {
  const { chainId, contractAddresses, provider, signer, accountAddress } =
    useContext(WalletContext);
  const [selectedStrategies, setSelectedStrategies] = useState<
    string[] | string
  >([]);
  const [selectedAssets, setSelectedAssets] = useState<string[] | string>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const sendTx = useSendTx();

  const getPosition = useCallback(
    async (vaultName: string) => {
      const vaults = contractAddresses['SSOV-V3']['VAULTS'];

      const ssovViewerContract = SsovV3Viewer__factory.connect(
        contractAddresses['SSOV-V3'].VIEWER,
        provider
      );

      const vaultAddress = vaults[vaultName];
      const vault = SsovV3__factory.connect(vaultAddress, provider);
      const currentEpoch = await vault.currentEpoch();

      const [
        tokensAddresses,
        epochStrikes,
        epochData,
        tokenPrice,
        isPut,
        epochTimes,
      ] = await Promise.all([
        await ssovViewerContract.getEpochStrikeTokens(
          currentEpoch,
          vaultAddress
        ),
        await vault.getEpochStrikes(currentEpoch),
        await vault.getEpochData(currentEpoch),
        await vault.getUnderlyingPrice(),
        await vault.isPut(),
        await vault.getEpochTimes(currentEpoch),
      ]);

      const epochEndTime = new Date(epochTimes[1].toNumber() * 1000);

      const settlementPrice = epochData.settlementPrice;

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
          let pnlAmount = settlementPrice.isZero()
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

          const assetName = getAssetFromVaultName(vaultName);

          pnlAmount = getUserReadableAmount(
            pnlAmount,
            getTokenDecimals(assetName, chainId)
          );

          const imgSrc = `/assets/${assetName}.svg`;

          return {
            strikeIndex,
            strikePrice,
            purchasedAmount,
            settleableAmount,
            pnlAmount,
            isSettleable,
            vaultName,
            imgSrc,
            isPut,
            epochEndTime,
            currentEpoch,
          };
        }
      );

      return userExercisableOptions;
    },
    [contractAddresses, provider]
  );

  const handleSettle = useCallback(
    async (
      vaultName: string,
      strikeIndex: number,
      userEpochStrikeTokenBalance: BigNumber,
      selectedEpoch: number
    ) => {
      const vaults = contractAddresses['SSOV-V3']['VAULTS'];

      const vaultAddress = vaults[vaultName];
      const vault = SsovV3__factory.connect(vaultAddress, provider);

      if (signer)
        await sendTx(
          vault
            .connect(signer)
            .settle(strikeIndex, userEpochStrikeTokenBalance, selectedEpoch)
        );

      await updatePositions();
    },
    [accountAddress, sendTx, signer, provider]
  );

  const updatePositions = useCallback(async () => {
    if (!provider || !accountAddress) return;

    setIsLoading(true);

    let _positions: any[] = [];
    const vaults = contractAddresses['SSOV-V3']['VAULTS'];

    const promises = [];

    for (let vaultName in vaults) promises.push(getPosition(vaultName));

    const results = await Promise.all(promises);

    results.forEach((result) => {
      result.forEach((position) => {
        if (position.purchasedAmount > 0) _positions.push(position);
      });
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
            <Box className="flex">
              <CircularProgress className="text-stieglitz p-2 my-8 mx-auto" />
            </Box>
          ) : positions.length === 0 ? (
            <Box className="flex-col p-8">
              <Box className="mx-auto">You do not have any positions</Box>
              <Link href="/ssov">
                <Button
                  className={
                    'rounded-md h-10 mt-3 mx-auto text-white hover:bg-opacity-70 bg-primary hover:bg-primary'
                  }
                >
                  Open SSOVs page
                </Button>
              </Link>
            </Box>
          ) : (
            <Box className="py-2">
              <Box className="grid grid-cols-12 px-4 py-2" gap={0}>
                <Box className="col-span-3 text-left">
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
                <Box className="col-span-1 text-left">
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
              {positions.map((position, i) => (
                <Box
                  key={i}
                  className="grid grid-cols-12 px-4 pt-2 pb-4"
                  gap={0}
                >
                  <Box className="col-span-3 text-left flex">
                    <img
                      src={position.imgSrc}
                      className="w-8 h-8 mr-2 object-cover"
                    />
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">{position.vaultName}</span>
                    </Typography>
                  </Box>
                  <Box className="col-span-1 text-left">
                    <Typography variant="h6" className="mt-2">
                      <span className="text-white bg-umbra rounded-md px-2 py-1">
                        ${position.strikePrice}
                      </span>
                    </Typography>
                  </Box>
                  <Box className="col-span-1 text-left">
                    <Typography variant="h5" className="mt-1">
                      <span
                        className={
                          position.isPut ? 'text-[#FF617D]' : 'text-[#6DFFB9]'
                        }
                      >
                        {position.isPut ? 'PUT' : 'CALL'}
                      </span>
                    </Typography>
                  </Box>
                  <Box className="col-span-1 text-left">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {position.purchasedAmount}
                      </span>
                    </Typography>
                  </Box>
                  <Box className="col-span-2 text-left">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {format(position.epochEndTime, 'dd/MM/yyyy')}
                      </span>
                    </Typography>
                  </Box>
                  <Box className="col-span-2 text-left">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-[#6DFFB9]">
                        {formatAmount(position.pnlAmount, 4)}
                      </span>
                    </Typography>
                  </Box>
                  <Box className="col-span-2">
                    <Box className="flex">
                      <CustomButton
                        size="medium"
                        className="px-2"
                        onClick={() =>
                          handleSettle(
                            position.vaultName,
                            position.strikeIndex,
                            position.settleableAmount,
                            position.currentEpoch
                          )
                        }
                        disabled={!position.isSettleable}
                        color="primary"
                      >
                        Settle
                      </CustomButton>
                    </Box>
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
