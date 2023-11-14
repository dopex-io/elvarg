import { useMemo, useState } from 'react';
import Link from 'next/link';
import { BigNumber } from 'ethers';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Input from '@mui/material/Input';

import SearchIcon from '@mui/icons-material/Search';

import cx from 'classnames';

import { useBoundStore } from 'store';

import Filter from 'components/common/Filter';
import SignerButton from 'components/common/SignerButton';
import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';

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
  CLAMM: [
    {
      span: 2,
      title: 'Vault',
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
      title: 'Strike',
    },
    {
      span: 2,
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
      },
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
      },
    );
    return _deposits;
  }, [portfolioData, searchText]);

  const filteredCLAMMLpPositions = useMemo(() => {
    const _positions: any[] = [];
    portfolioData?.userCLAMMLpPositions?.map(
      (position: { market: string | string[] }) => {
        let toAdd = true;
        if (
          !position.market?.includes(searchText.toUpperCase()) &&
          searchText !== ''
        )
          toAdd = false;
        if (toAdd) _positions.push(position);
      },
    );
    return _positions;
  }, [portfolioData, searchText]);

  return (
    <div>
      <div className="mt-9 ml-5 mr-5">
        <Typography variant="h4">Your Deposits</Typography>
        <div className="bg-cod-gray mt-3 rounded-md text-center px-2 overflow-auto md:overflow-hidden">
          <div className="flex py-3 px-3 border-b-[1.5px] border-umbra">
            <div className="mr-3 mt-0.5">
              <Filter
                activeFilters={selectedSides}
                setActiveFilters={setSelectedSides}
                text={'Side'}
                options={sides}
                multiple={true}
                showImages={false}
              />
            </div>

            <div className="ml-auto">
              <Input
                value={searchText}
                onChange={(e) => setSearchText(String(e.target.value))}
                disableUnderline={true}
                type="string"
                className="bg-umbra text-mineshaft rounded-md px-3 pb-1"
                classes={{ input: 'text-right' }}
                placeholder="Type something"
                startAdornment={
                  <div className="mr-1.5 mt-1 opacity-80 w-18">
                    <SearchIcon />
                  </div>
                }
              />
            </div>
          </div>
          {loadingState > 0 ? (
            loadingState === 1 ? (
              <div className="flex">
                <CircularProgress className="text-stieglitz p-2 my-8 mx-auto" />
              </div>
            ) : (
              <SignerButton className="my-4">Connect Wallet</SignerButton>
            )
          ) : filteredSSOVDeposits.length === 0 &&
            filteredStraddlesDeposits.length === 0 &&
            filteredCLAMMLpPositions.length ? (
            <div className="flex-col p-9 md:min-w-full min-w-[1500px]">
              <div className="mx-auto">You do not have any deposits</div>
              <Link href="/ssov">
                <Button
                  className={
                    'rounded-md h-10 mt-5 mx-auto text-white hover:bg-opacity-70 bg-primary hover:bg-primary'
                  }
                >
                  Open SSOVs page
                </Button>
              </Link>
            </div>
          ) : (
            <div className="py-2 md:min-w-full min-w-[1500px]">
              {filteredSSOVDeposits.length > 0 ? (
                <div className="grid grid-cols-12 px-4 py-2">
                  {headerCells['ssov']!.map((cell, i) => (
                    <div
                      key={i}
                      className={`col-span-${cell['span']} text-left`}
                    >
                      <Typography variant="h5">
                        <span className="text-stieglitz">{cell['title']}</span>
                      </Typography>
                    </div>
                  ))}
                </div>
              ) : null}
              {filteredSSOVDeposits.map((deposit, i) => (
                <div key={i} className="grid grid-cols-12 px-4 pt-2 pb-4">
                  <div className="col-span-2 text-left flex">
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
                  </div>

                  <div className="col-span-2 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">{deposit.vaultType}</span>
                    </Typography>
                  </div>

                  <div className="col-span-1 text-left">
                    <Typography variant="h5" className="mt-1">
                      <span
                        className={
                          deposit.isPut ? 'text-[#FF617D]' : 'text-[#6DFFB9]'
                        }
                      >
                        {deposit.isPut ? 'PUT' : 'CALL'}
                      </span>
                    </Typography>
                  </div>

                  <div className="col-span-1 text-left">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">{deposit.epoch}</span>
                    </Typography>
                  </div>

                  <div className="col-span-2 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {formatAmount(
                          getUserReadableAmount(deposit.amount, 18),
                          2,
                        )}
                      </span>
                    </Typography>
                  </div>

                  <div className="col-span-2 text-left">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {getUserReadableAmount(deposit.strike, 8)}
                      </span>
                    </Typography>
                  </div>

                  <div className="col-span-1">
                    <div className="flex">
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
                    </div>
                  </div>
                </div>
              ))}

              {filteredStraddlesDeposits.length > 0 ? (
                <div
                  className={cx(
                    'grid grid-cols-12 px-4 py-2',
                    filteredSSOVDeposits.length > 0
                      ? 'border-t-[1.5px] pt-6 border-umbra'
                      : '',
                  )}
                >
                  {headerCells['straddle']!.map((cell, i) => (
                    <div
                      key={i}
                      className={`col-span-${cell['span']} text-left`}
                    >
                      <Typography variant="h5">
                        <span className="text-stieglitz">{cell['title']}</span>
                      </Typography>
                    </div>
                  ))}
                </div>
              ) : null}
              {filteredStraddlesDeposits.map((deposit, i) => (
                <div
                  key={i}
                  className={cx(
                    'grid grid-cols-12 px-4 pt-2 pb-4',
                    filteredSSOVDeposits.length > 0 ? 'mt-2' : '',
                  )}
                >
                  <div className="col-span-2 text-left flex">
                    <img
                      src={`/images/tokens/${deposit.assetName.toLowerCase()}.svg`}
                      className="w-8 h-8 mr-2 object-cover"
                      alt={deposit.vaultName}
                    />
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {deposit.assetName.toUpperCase() === 'USDC'
                          ? 'USDC.e'
                          : deposit.assetName.toUpperCase()}
                      </span>
                    </Typography>
                  </div>

                  <div className="col-span-2 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">{`${
                        deposit.vaultName.split('-')[0]
                      } Straddle`}</span>
                    </Typography>
                  </div>

                  <div className="col-span-2 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {formatAmount(
                          getUserReadableAmount(deposit.amount, 6),
                          4,
                        )}
                      </span>
                    </Typography>
                  </div>

                  <div className="col-span-2 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">{deposit.epoch}</span>
                    </Typography>
                  </div>

                  <div className="col-span-1">
                    <div className="flex">
                      <a target="_blank" rel="noreferrer" href={deposit.link}>
                        <CustomButton
                          size="medium"
                          className="px-2"
                          color={deposit.link !== '#' ? 'primary' : 'umbra'}
                        >
                          Open
                        </CustomButton>
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {filteredCLAMMLpPositions.length > 0 ? (
                <div
                  className={cx(
                    'grid grid-cols-12 px-4 py-2',
                    filteredStraddlesDeposits.length > 0
                      ? 'border-t-[1.5px] pt-6 border-umbra'
                      : '',
                  )}
                >
                  {headerCells['CLAMM']!.map((cell, i) => (
                    <div
                      key={i}
                      className={`col-span-${cell['span']} text-left`}
                    >
                      <Typography variant="h5">
                        <span className="text-stieglitz">{cell['title']}</span>
                      </Typography>
                    </div>
                  ))}
                </div>
              ) : null}
              {filteredCLAMMLpPositions.map((position, i) => (
                <div key={i} className={'grid grid-cols-12 px-4 pt-2 pb-4'}>
                  <div className="col-span-2 text-left flex">
                    <img
                      src={`/images/tokens/${position.assetName.toLowerCase()}.svg`}
                      className="w-8 h-8 mr-2 object-cover"
                      alt={position.market}
                    />
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {position.market.toUpperCase()}
                      </span>
                    </Typography>
                  </div>
                  <div className="col-span-2 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">CLAMM LP</span>
                    </Typography>
                  </div>
                  <div className="col-span-2 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {BigNumber.from(position.token0LiquidityInToken).gt(
                          0,
                        ) ? (
                          <span>
                            {formatAmount(
                              getUserReadableAmount(
                                position.token0LiquidityInToken,
                                position.token0Decimals,
                              ),
                              2,
                            )}{' '}
                            {position.token0Symbol}
                          </span>
                        ) : null}

                        {BigNumber.from(position.token1LiquidityInToken).gt(
                          0,
                        ) ? (
                          <span>
                            {formatAmount(
                              getUserReadableAmount(
                                position.token1LiquidityInToken,
                                position.token1Decimals,
                              ),
                              2,
                            )}{' '}
                            {position.token1Symbol}
                          </span>
                        ) : null}
                      </span>
                    </Typography>
                  </div>
                  <div className="col-span-2 text-left flex">
                    <Typography variant="h5" className="mt-1">
                      <span className="text-white">
                        {formatAmount(position.strikePrice, 2)}
                      </span>
                    </Typography>
                  </div>
                  <div className="col-span-2 text-left">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={
                        '/clamm/' +
                        position.token0Symbol +
                        '-' +
                        position.token1Symbol
                      }
                    >
                      <CustomButton
                        size="medium"
                        className="px-2"
                        color="primary"
                      >
                        Open
                      </CustomButton>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
