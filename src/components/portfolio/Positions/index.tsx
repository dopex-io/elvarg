import { useCallback, useContext, useEffect, useState, useMemo } from 'react';
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
  ERC20,
} from '@dopex-io/sdk';

import { MAX_VALUE } from 'constants/index';
import { WalletContext } from 'contexts/Wallet';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import isZeroAddress from 'utils/contracts/isZeroAddress';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import formatAmount from 'utils/general/formatAmount';
import getAssetFromVaultName from 'utils/contracts/getAssetFromVaultName';

import Filter from '../Filter';

const sides: string[] = ['CALL', 'PUT'];

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
  assetName: string;
}

export default function Positions() {
  const { chainId, contractAddresses, provider, signer, accountAddress } =
    useContext(WalletContext);
  const [selectedSides, setSelectedSides] = useState<string[] | string>([
    'CALL',
    'PUT',
  ]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
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
                return token.balanceOf(String(accountAddress));
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
            assetName,
          };
        }
      );

      return userExercisableOptions;
    },
    [contractAddresses, provider, accountAddress, chainId]
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
  }, [provider, accountAddress, contractAddresses, getPosition]);

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

      const ssovViewerContract = SsovV3Viewer__factory.connect(
        contractAddresses['SSOV-V3'].VIEWER,
        provider
      );

      const tokensAddresses = await ssovViewerContract.getEpochStrikeTokens(
        selectedEpoch,
        vaultAddress
      );

      if (signer) {
        const token: ERC20 = ERC20__factory.connect(
          String(tokensAddresses[strikeIndex]),
          provider
        );

        const allowance = await token.allowance(
          String(accountAddress),
          vaultAddress
        );

        if (allowance.eq(0))
          await sendTx(token.connect(signer).approve(vaultAddress, MAX_VALUE));

        await sendTx(
          vault
            .connect(signer)
            .settle(strikeIndex, userEpochStrikeTokenBalance, selectedEpoch)
        );
      }

      await updatePositions();
    },
    [
      accountAddress,
      sendTx,
      signer,
      provider,
      contractAddresses,
      updatePositions,
    ]
  );

  const filteredPositions = useMemo(() => {
    const _positions: Position[] = [];
    positions.map((position) => {
      let toAdd = true;
      if (
        !position.vaultName.includes(searchText.toUpperCase()) &&
        searchText !== ''
      )
        toAdd = false;
      if (!selectedSides.includes(position.isPut ? 'PUT' : 'CALL'))
        toAdd = false;
      if (toAdd) _positions.push(position);
    });
    return _positions;
  }, [positions, searchText, selectedSides]);

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
                activeFilters={selectedSides}
                setActiveFilters={setSelectedSides}
                text={'Side'}
                options={sides}
                multiple={true}
                showImages={false}
              />
            </Box>

            <Box className="ml-auto">
              <Input
                value={searchText}
                onChange={(e) => setSearchText(String(e.target.value))}
                disableUnderline={true}
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
            <Box className="flex-col p-9">
              <Box className="mx-auto">You do not have any positions</Box>
              <Link href="/ssov">
                <Button
                  className={
                    'rounded-md h-10 mt-5 mx-auto text-white hover:bg-opacity-70 bg-primary hover:bg-primary'
                  }
                >
                  Open SSOVs page
                </Button>
              </Link>
            </Box>
          ) : (
            <Box className="py-2">
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
              {filteredPositions.map((position, i) => (
                <Box
                  key={i}
                  className="grid grid-cols-12 px-4 pt-2 pb-4"
                  gap={0}
                >
                  <Box className="col-span-2 text-left flex">
                    <img
                      src={position.imgSrc}
                      className="w-8 h-8 mr-2 object-cover"
                      alt={position.vaultName}
                    />
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {position.assetName.toUpperCase()}
                      </span>
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
                      <span
                        className={
                          position.pnlAmount >= 0
                            ? 'text-[#6DFFB9]'
                            : 'text-[#FF617D]'
                        }
                      >
                        {formatAmount(position.pnlAmount, 4)}{' '}
                        {position.isPut
                          ? '2CRV'
                          : position.assetName.toUpperCase()}
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
