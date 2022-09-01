import { useContext, useState, useMemo } from 'react';
import { BigNumber } from 'ethers';
import Link from 'next/link';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import format from 'date-fns/format';

import { PortfolioContext } from 'contexts/Portfolio';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import Filter from '../Filter';
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
  const { portfolioData, isLoading } = useContext(PortfolioContext);
  const [selectedSides, setSelectedSides] = useState<string[] | string>([
    'CALL',
    'PUT',
  ]);
  const [searchText, setSearchText] = useState<string>('');

  const positions = useMemo(() => {
    const _positions: Position[] = [];
    return _positions;
  }, [portfolioData]);

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
