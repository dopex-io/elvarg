import { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import { BigNumber } from 'ethers';
import Link from 'next/link';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import format from 'date-fns/format';
import { SsovV3Viewer__factory, SsovV3__factory } from '@dopex-io/sdk';

import { WalletContext } from 'contexts/Wallet';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import Filter from '../Filter';
import getAssetFromVaultName from 'utils/contracts/getAssetFromVaultName';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import formatAmount from 'utils/general/formatAmount';

const sides: string[] = ['CALL', 'PUT'];

interface Position {
  collateralAmount: number;
  settleableAmount: BigNumber;
  strikePrice: number;
  vaultName: string;
  imgSrc: string;
  isPut: boolean;
  epochEndTime: Date;
  currentEpoch: number;
  assetName: string;
  accruedRewards0: number;
  accruedRewards1: number;
  accruedPremiums: number;
}

export default function Deposits() {
  const { chainId, contractAddresses, provider } = useContext(WalletContext);
  const accountAddress = '0xc7ed7bf2a126983dfde425126b03693d40477ba7';
  const [selectedSides, setSelectedSides] = useState<string[] | string>([
    'CALL',
    'PUT',
  ]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');

  const getPosition = useCallback(
    async (vaultName: string) => {
      const vaults = contractAddresses['SSOV-V3']['VAULTS'];

      const ssovViewerContract = SsovV3Viewer__factory.connect(
        contractAddresses['SSOV-V3'].VIEWER,
        provider
      );

      const vaultAddress = vaults[vaultName];
      const vault = SsovV3__factory.connect(vaultAddress, provider);

      const writePositions = await ssovViewerContract.walletOfOwner(
        String(accountAddress),
        vaultAddress
      );

      const currentEpoch = await vault.currentEpoch();

      const [isPut, epochTimes] = await Promise.all([
        await vault.isPut(),
        await vault.getEpochTimes(currentEpoch),
      ]);

      const epochEndTime = new Date(epochTimes[1].toNumber() * 1000);

      const data = await Promise.all(
        writePositions.map((i) => {
          return vault.writePosition(i);
        })
      );

      const moreData = await Promise.all(
        writePositions.map((i) => {
          return ssovViewerContract.getWritePositionValue(i, vaultAddress);
        })
      );

      const assetName = getAssetFromVaultName(vaultName);

      const imgSrc = `/assets/${assetName}.svg`;

      const decimals = getTokenDecimals(assetName, chainId);

      return data.map((o, i) => {
        return {
          vaultName: vaultName,
          imgSrc: imgSrc,
          assetName: assetName,
          isPut: isPut,
          epochEndTime: epochEndTime,
          tokenId: writePositions[i],
          collateralAmount: getUserReadableAmount(
            o.collateralAmount,
            isPut ? 18 : decimals
          ),
          epoch: o.epoch.toNumber(),
          strikePrice: getUserReadableAmount(o.strike, 8),
          accruedRewards0: getUserReadableAmount(
            String(moreData[i]?.rewardTokenWithdrawAmounts[0]),
            assetName === 'ETH' || isPut ? 18 : decimals
          ),
          accruedRewards1: getUserReadableAmount(
            moreData[i]?.rewardTokenWithdrawAmounts[1]
              ? String(moreData[i]?.rewardTokenWithdrawAmounts[1])
              : 0,
            assetName === 'ETH' || isPut ? 18 : decimals
          ),
          accruedPremiums: getUserReadableAmount(
            String(
              moreData[i]?.collateralTokenWithdrawAmount.sub(o.collateralAmount)
            ),
            isPut ? 8 : decimals
          ),
        };
      });
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
        _positions.push(position);
      });
    });

    setPositions(_positions);
    setIsLoading(false);
  }, [provider, accountAddress, contractAddresses, getPosition]);

  const filteredPositions = useMemo(() => {
    const _positions: Position[] = [];
    positions.map((position) => {
      let toAdd = true;
      if (
        !position?.vaultName?.includes(searchText.toUpperCase()) &&
        searchText !== ''
      )
        toAdd = false;
      if (!selectedSides.includes(position?.isPut ? 'PUT' : 'CALL'))
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
        <Typography variant="h4">Your Deposits</Typography>
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
              <Box className="mx-auto">You do not have any deposits</Box>
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
                <Box className="col-span-1 text-left">
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
                    <span className="text-stieglitz">Collateral Amount</span>
                  </Typography>
                </Box>
                <Box className="col-span-2 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">Accrued Rewards</span>
                  </Typography>
                </Box>
                <Box className="col-span-2 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">Accrued Premiums</span>
                  </Typography>
                </Box>
                <Box className="col-span-2 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">Epoch End</span>
                  </Typography>
                </Box>
                <Box className="col-span-1 text-left">
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
                  <Box className="col-span-1 text-left flex">
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
                  <Box className="col-span-2 text-left">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {position.collateralAmount}{' '}
                        {position.isPut
                          ? '2CRV'
                          : position.assetName.toUpperCase()}
                      </span>
                    </Typography>
                  </Box>
                  <Box className="col-span-2 text-left">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {formatAmount(position.accruedRewards0, 6)}{' '}
                        {position.assetName.toUpperCase()} {' | '}
                        {formatAmount(position.accruedRewards1, 6)}{' '}
                        {position.assetName === 'dpx' ? 'RDPX' : 'DPX'}
                      </span>
                    </Typography>
                  </Box>
                  <Box className="col-span-2 text-left">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {formatAmount(position.accruedPremiums, 6)}{' '}
                        {position.isPut
                          ? '2CRV'
                          : position.assetName.toUpperCase()}
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
                  <Box className="col-span-1">
                    <Box className="flex">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`/ssov-v3/${position.vaultName}`}
                      >
                        <CustomButton
                          size="medium"
                          className="px-2"
                          color="primary"
                        >
                          Open
                        </CustomButton>
                      </a>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
