import { useContext, useState, useMemo } from 'react';
import Link from 'next/link';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';

import { PortfolioContext, UserPosition } from 'contexts/Portfolio';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';

import Filter from 'components/common/Filter';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getValueColorClass from 'utils/general/getValueColorClass';

import formatAmount from 'utils/general/formatAmount';

const sides: string[] = ['CALL', 'PUT'];

export default function Positions() {
  const { portfolioData, isLoading } = useContext(PortfolioContext);
  const [selectedSides, setSelectedSides] = useState<string[] | string>([
    'CALL',
    'PUT',
  ]);
  const [searchText, setSearchText] = useState<string>('');

  const filteredPositions = useMemo(() => {
    const _positions: UserPosition[] = [];
    portfolioData?.userPositions?.map((position) => {
      let toAdd = true;
      if (
        !position.ssovName.includes(searchText.toUpperCase()) &&
        searchText !== ''
      )
        toAdd = false;
      if (!selectedSides.includes(position.isPut ? 'PUT' : 'CALL'))
        toAdd = false;
      if (toAdd) _positions.push(position);
    });
    return _positions;
  }, [portfolioData, searchText, selectedSides]);

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
          ) : filteredPositions.length === 0 ? (
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
                <Box className="col-span-1 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">Asset</span>
                  </Typography>
                </Box>
                <Box className="col-span-2 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">Market</span>
                  </Typography>
                </Box>

                <Box className="col-span-1 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">Side</span>
                  </Typography>
                </Box>

                <Box className="col-span-1 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">Epoch</span>
                  </Typography>
                </Box>

                <Box className="col-span-1 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">Strike</span>
                  </Typography>
                </Box>

                <Box className="col-span-1 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">Amount</span>
                  </Typography>
                </Box>

                <Box className="col-span-1 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">PnL</span>
                  </Typography>
                </Box>

                <Box className="col-span-1 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">Expiry</span>
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
                  <Box className="col-span-1 text-left flex">
                    <img
                      src={`/images/tokens/${position.assetName.toLowerCase()}.svg`}
                      className="w-8 h-8 mr-2 object-cover"
                      alt={position.ssovName}
                    />
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {position.assetName.toUpperCase()}
                      </span>
                    </Typography>
                  </Box>

                  <Box className="col-span-2 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">{position.vaultType}</span>
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

                  <Box className="col-span-1 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">{position.epoch}</span>
                    </Typography>
                  </Box>

                  <Box className="col-span-1 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {getUserReadableAmount(position.strike, 8)}
                      </span>
                    </Typography>
                  </Box>

                  <Box className="col-span-1 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {formatAmount(
                          getUserReadableAmount(position.amount, 18),
                          4
                        )}
                      </span>
                    </Typography>
                  </Box>

                  <Box className="col-span-1 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        <Typography
                          variant="h5"
                          component="div"
                          className={
                            position.pnl
                              ? getValueColorClass(Number(position.pnl))
                              : ''
                          }
                        >
                          {position.pnl
                            ? '$' + formatAmount(position.pnl, 2)
                            : '--'}
                        </Typography>
                      </span>
                    </Typography>
                  </Box>

                  <Box className="col-span-1 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">{position.expiry}</span>
                    </Typography>
                  </Box>

                  <Box className="col-span-1">
                    <Box className="flex">
                      <a target="_blank" rel="noreferrer" href={position.link}>
                        <CustomButton
                          size="medium"
                          className="px-2"
                          color={position.link !== '#' ? 'primary' : 'umbra'}
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

          <Box></Box>
        </Box>
      </Box>
    </Box>
  );
}
