import { useState, useMemo } from 'react';
import Link from 'next/link';

import cx from 'classnames';

import { useBoundStore } from 'store';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import Filter from 'components/common/Filter';
import WalletButton from 'components/common/WalletButton';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getValueColorClass from 'utils/general/getValueColorClass';
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
      span: 1,
      title: 'Strike',
    },
    {
      span: 1,
      title: 'Amount',
    },
    {
      span: 1,
      title: 'Pnl',
    },
    {
      span: 2,
      title: 'Expiry',
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
      title: 'AP Strike',
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

export default function Positions() {
  const { portfolioData, accountAddress } = useBoundStore();
  const [selectedSides, setSelectedSides] = useState<string[] | string>([
    'CALL',
    'PUT',
  ]);
  const [searchText, setSearchText] = useState<string>('');

  const filteredSSOVPositions = useMemo(() => {
    const _positions: any[] = [];
    portfolioData?.userSSOVPositions?.map(
      (position: { ssovName: string | string[]; isPut: any }) => {
        let toAdd = true;
        if (
          !position.ssovName.includes(searchText.toUpperCase()) &&
          searchText !== ''
        )
          toAdd = false;
        if (!selectedSides.includes(position.isPut ? 'PUT' : 'CALL'))
          toAdd = false;
        if (toAdd) _positions.push(position);
      }
    );
    return _positions;
  }, [portfolioData, searchText, selectedSides]);

  const loadingState = useMemo(() => {
    if (!accountAddress) return 2;
    else if (portfolioData?.isLoading) return 1;
    else return 0;
  }, [accountAddress, portfolioData?.isLoading]);

  const filteredStraddlesPositions = useMemo(() => {
    const _positions: any[] = [];
    portfolioData?.userStraddlesPositions?.map(
      (position: { vaultName: string | string[] }) => {
        let toAdd = true;
        if (
          !position.vaultName.includes(searchText.toUpperCase()) &&
          searchText !== ''
        )
          toAdd = false;
        if (toAdd) _positions.push(position);
      }
    );
    return _positions;
  }, [portfolioData, searchText]);

  return (
    <Box>
      <Box className="mt-9 ml-5 mr-5">
        <Typography variant="h4">Open Positions</Typography>
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
              <WalletButton className="my-4">Connect Wallet</WalletButton>
            )
          ) : filteredSSOVPositions.length === 0 &&
            filteredStraddlesPositions.length === 0 ? (
            <Box className="flex-col p-9 md:min-w-full min-w-[1500px]">
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
            <Box className="py-2 md:min-w-full min-w-[1500px]">
              {filteredSSOVPositions.length > 0 ? (
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
              {filteredSSOVPositions.map((position, i) => (
                <Box
                  key={i}
                  className="grid grid-cols-12 px-4 pt-2 pb-4"
                  gap={0}
                >
                  <Box className="col-span-2 text-left flex">
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
                            ? (Number(position.pnl) >= 0 ? '$' : '-$') +
                              formatAmount(Math.abs(Number(position.pnl)), 2)
                            : '--'}
                        </Typography>
                      </span>
                    </Typography>
                  </Box>
                  <Box className="col-span-2 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">{position.expiry}</span>
                    </Typography>
                  </Box>
                  <Box className="col-span-1">
                    <Box className="flex">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={position.link.includes('#') ? '#' : position.link}
                      >
                        <CustomButton
                          size="medium"
                          className="px-2"
                          color={
                            position.link.includes('#') ? 'umbra' : 'primary'
                          }
                        >
                          Open
                        </CustomButton>
                      </a>
                    </Box>
                  </Box>
                </Box>
              ))}
              {filteredStraddlesPositions.length > 0 ? (
                <Box
                  className={cx(
                    'grid grid-cols-12 px-4 py-2',
                    filteredSSOVPositions.length > 0
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
              {filteredStraddlesPositions.map((position, i) => (
                <Box
                  key={i}
                  className={'grid grid-cols-12 px-4 pt-2 pb-4'}
                  gap={0}
                >
                  <Box className="col-span-2 text-left flex">
                    <img
                      src={`/images/tokens/${position.assetName.toLowerCase()}.svg`}
                      className="w-8 h-8 mr-2 object-cover"
                      alt={position.vaultName}
                    />
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {position.assetName.toUpperCase()}
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
                          getUserReadableAmount(position.amount, 18),
                          2
                        )}
                      </span>
                    </Typography>
                  </Box>
                  <Box className="col-span-2 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {formatAmount(
                          getUserReadableAmount(position.strikePrice, 8),
                          2
                        )}
                      </span>
                    </Typography>
                  </Box>
                  <Box className="col-span-2 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">{position.epoch}</span>
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
        </Box>
      </Box>
    </Box>
  );
}
