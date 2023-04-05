import { useState, useMemo } from 'react';
import Link from 'next/link';
import cx from 'classnames';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import SignerButton from 'components/common/SignerButton';
import Filter from 'components/common/Filter';

import { useBoundStore } from 'store';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const sides: string[] = ['CALL', 'PUT'];

const headerCells: { [key: string]: { span: number; title: string }[] } = {
  ssov: [
    {
      span: 2,
      title: 'Asset',
    },
    {
      span: 2,
      title: 'Market',
    },
    {
      span: 1,
      title: 'Side',
    },
    {
      span: 1,
      title: 'Epoch',
    },
    {
      span: 2,
      title: 'Amount',
    },
    {
      span: 2,
      title: 'Strike',
    },
    {
      span: 1,
      title: 'Action',
    },
  ],
  straddle: [
    {
      span: 2,
      title: 'Asset',
    },
    {
      span: 2,
      title: 'Market',
    },
    {
      span: 2,
      title: 'Amount',
    },
    {
      span: 2,
      title: 'Epoch',
    },
    {
      span: 1,
      title: 'Action',
    },
  ],
};

export default function Deposits() {
  const { accountAddress, portfolioData } = useBoundStore();

  const [selectedSides, setSelectedSides] = useState<string[] | string>([
    'CALL',
    'PUT',
  ]);
  const [searchText, setSearchText] = useState<string>('');

  const filteredSSOVDeposits = useMemo(() => {
    const _deposits: any[] = [];

    portfolioData?.userSSOVDeposits?.map(
      (deposit: { ssovName: string | string[]; isPut: any }) => {
        let toAdd = true;
        if (
          !deposit?.ssovName?.includes(searchText.toUpperCase()) &&
          searchText !== ''
        )
          toAdd = false;
        if (!selectedSides.includes(deposit?.isPut ? 'PUT' : 'CALL'))
          toAdd = false;
        if (toAdd) _deposits.push(deposit);
      }
    );
    return _deposits;
  }, [portfolioData, searchText, selectedSides]);

  const loadingState = useMemo(() => {
    if (!accountAddress) return 2;
    else if (portfolioData?.isLoading) return 1;
    else return 0;
  }, [accountAddress, portfolioData?.isLoading]);

  const filteredStraddlesDeposits = useMemo(() => {
    const _deposits: any[] = [];

    portfolioData?.userStraddlesDeposits?.map(
      (deposit: { vaultName: string | string[] }) => {
        let toAdd = true;
        if (
          !deposit?.vaultName?.includes(searchText.toUpperCase()) &&
          searchText !== ''
        )
          toAdd = false;
        if (toAdd) _deposits.push(deposit);
      }
    );
    return _deposits;
  }, [portfolioData, searchText]);

  return (
    <Box>
      <Box className="mt-9 ml-5 mr-5">
        <Typography variant="h4">Your Deposits</Typography>
        <Box className="bg-cod-gray mt-3 rounded-md text-center px-2 overflow-auto md:overflow-hidden">
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
          {loadingState > 0 ? (
            loadingState === 1 ? (
              <Box className="flex">
                <CircularProgress className="text-stieglitz p-2 my-8 mx-auto" />
              </Box>
            ) : (
              <SignerButton className="my-4">Connect Wallet</SignerButton>
            )
          ) : filteredSSOVDeposits.length === 0 &&
            filteredStraddlesDeposits.length === 0 ? (
            <Box className="flex-col p-9 md:min-w-full min-w-[1500px]">
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
            <Box className="py-2 md:min-w-full min-w-[1500px]">
              {filteredSSOVDeposits.length > 0 ? (
                <Box className="grid grid-cols-12 px-4 py-2" gap={0}>
                  {headerCells['ssov']!.map((cell, i) => (
                    <Box
                      key={i}
                      className={`col-span-${cell['span']} text-left`}
                    >
                      <Typography variant="h5">
                        <span className="text-stieglitz">{cell['title']}</span>
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : null}
              {filteredSSOVDeposits.map((deposit, i) => (
                <Box
                  key={i}
                  className="grid grid-cols-12 px-4 pt-2 pb-4"
                  gap={0}
                >
                  <Box className="col-span-2 text-left flex">
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

                  <Box className="col-span-1 text-left">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">{deposit.epoch}</span>
                    </Typography>
                  </Box>

                  <Box className="col-span-2 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {formatAmount(
                          getUserReadableAmount(deposit.amount, 18),
                          2
                        )}
                      </span>
                    </Typography>
                  </Box>

                  <Box className="col-span-2 text-left">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {getUserReadableAmount(deposit.strike, 8)}
                      </span>
                    </Typography>
                  </Box>

                  <Box className="col-span-1">
                    <Box className="flex">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={deposit.link.includes('#') ? '#' : deposit.link}
                      >
                        <CustomButton
                          size="medium"
                          className="px-2"
                          color={
                            deposit.link.includes('#') ? 'umbra' : 'primary'
                          }
                        >
                          Open
                        </CustomButton>
                      </a>
                    </Box>
                  </Box>
                </Box>
              ))}

              {filteredStraddlesDeposits.length > 0 ? (
                <Box
                  className={cx(
                    'grid grid-cols-12 px-4 py-2',
                    filteredSSOVDeposits.length > 0
                      ? 'border-t-[1.5px] pt-6 border-umbra'
                      : ''
                  )}
                  gap={0}
                >
                  {headerCells['straddle']!.map((cell, i) => (
                    <Box
                      key={i}
                      className={`col-span-${cell['span']} text-left`}
                    >
                      <Typography variant="h5">
                        <span className="text-stieglitz">{cell['title']}</span>
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : null}
              {filteredStraddlesDeposits.map((deposit, i) => (
                <Box
                  key={i}
                  className={cx(
                    'grid grid-cols-12 px-4 pt-2 pb-4',
                    filteredSSOVDeposits.length > 0 ? 'mt-2' : ''
                  )}
                  gap={0}
                >
                  <Box className="col-span-2 text-left flex">
                    <img
                      src={`/images/tokens/${deposit.assetName.toLowerCase()}.svg`}
                      className="w-8 h-8 mr-2 object-cover"
                      alt={deposit.vaultName}
                    />
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {deposit.assetName.toUpperCase()}
                      </span>
                    </Typography>
                  </Box>

                  <Box className="col-span-2 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">Straddle</span>
                    </Typography>
                  </Box>

                  <Box className="col-span-2 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {formatAmount(
                          getUserReadableAmount(deposit.amount, 6),
                          4
                        )}
                      </span>
                    </Typography>
                  </Box>

                  <Box className="col-span-2 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">{deposit.epoch}</span>
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
