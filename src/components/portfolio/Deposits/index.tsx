import { useContext, useState, useMemo } from 'react';
import Link from 'next/link';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';

import { PortfolioContext, UserSSOVDeposit } from 'contexts/Portfolio';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';

import Filter from 'components/common/Filter';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

const sides: string[] = ['CALL', 'PUT'];

export default function Deposits() {
  const { portfolioData, isLoading } = useContext(PortfolioContext);
  const [selectedSides, setSelectedSides] = useState<string[] | string>([
    'CALL',
    'PUT',
  ]);
  const [searchText, setSearchText] = useState<string>('');

  const filteredDeposits = useMemo(() => {
    const _deposits: UserSSOVDeposit[] = [];

    portfolioData?.userSSOVDeposits?.map((deposit) => {
      let toAdd = true;
      if (
        !deposit?.ssovName?.includes(searchText.toUpperCase()) &&
        searchText !== ''
      )
        toAdd = false;
      if (!selectedSides.includes(deposit?.isPut ? 'PUT' : 'CALL'))
        toAdd = false;
      if (toAdd) _deposits.push(deposit);
    });
    return _deposits;
  }, [portfolioData, searchText, selectedSides]);

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
          ) : filteredDeposits.length === 0 ? (
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
                    <span className="text-stieglitz">Amount</span>
                  </Typography>
                </Box>
                <Box className="col-span-1 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">Strike</span>
                  </Typography>
                </Box>
                <Box className="col-span-1 text-left">
                  <Typography variant="h5">
                    <span className="text-stieglitz">Action</span>
                  </Typography>
                </Box>
              </Box>
              {filteredDeposits.map((deposit, i) => (
                <Box
                  key={i}
                  className="grid grid-cols-12 px-4 pt-2 pb-4"
                  gap={0}
                >
                  <Box className="col-span-1 text-left flex">
                    <img
                      src={`/images/tokens/${deposit.assetName.toLowerCase()}.svg`}
                      className="w-8 h-8 mr-2 object-cover"
                      alt={deposit.ssovName}
                    />
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {deposit.assetName.toUpperCase()}
                      </span>
                    </Typography>
                  </Box>

                  <Box className="col-span-2 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">{deposit.vaultType}</span>
                    </Typography>
                  </Box>

                  <Box className="col-span-1 text-left">
                    <Typography variant="h5" className="mt-1">
                      <span
                        className={
                          deposit.isPut ? 'text-[#FF617D]' : 'text-[#6DFFB9]'
                        }
                      >
                        {deposit.isPut ? 'PUT' : 'CALL'}
                      </span>
                    </Typography>
                  </Box>

                  <Box className="col-span-1 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">{deposit.epoch}</span>
                    </Typography>
                  </Box>

                  <Box className="col-span-1 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {getUserReadableAmount(deposit.amount, 18)}
                      </span>
                    </Typography>
                  </Box>

                  <Box className="col-span-1 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {getUserReadableAmount(deposit.strike, 8)}
                      </span>
                    </Typography>
                  </Box>

                  <Box className="col-span-1">
                    <Box className="flex">
                      <a target="_blank" rel="noreferrer" href={deposit.link}>
                        <CustomButton
                          size="medium"
                          className="px-2"
                          color={deposit.link !== '#' ? 'primary' : 'umbra'}
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
