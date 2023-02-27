import { BigNumber } from 'ethers';

import { Box } from '@mui/material';

import { Input, Typography } from 'components/UI';

import { getUserReadableAmount } from 'utils/contracts';
import { formatAmount } from 'utils/general';

import { DECIMALS_TOKEN } from 'constants/index';

interface BorrowFormProps {
  underlyingSymbol: string;
  onChange: (e: {
    target: {
      value: React.SetStateAction<string | number>;
    };
  }) => void;
  underlyingBalance: BigNumber;
  totalSupply: number;
  collatToDeposit: number;
  borrowAmountUsd: string | number;
}

export const BorrowForm = ({
  underlyingSymbol,
  onChange,
  underlyingBalance,
  totalSupply,
  collatToDeposit,
  borrowAmountUsd,
}: BorrowFormProps) => {
  return (
    <>
      <Box className="bg-umbra rounded-xl">
        <Input
          size="small"
          variant="default"
          type="number"
          placeholder="0.0"
          className="p-3"
          value={borrowAmountUsd}
          onChange={onChange}
          leftElement={
            <Box className="flex my-auto">
              <Box
                className={`flex w-[6.2rem] mr-3 bg-cod-gray rounded-full space-x-2 p-1 pr-4`}
              >
                <img
                  src="/images/tokens/2crv.svg"
                  alt="usdc"
                  className="h-8 p-1"
                />
                <Typography
                  variant="h5"
                  color="white"
                  className="flex items-center ml-2"
                >
                  2CRV
                </Typography>
              </Box>
            </Box>
          }
        />
        <Box className="flex justify-between pb-3 px-5 pt-0">
          <Typography variant="h6" color="stieglitz">
            Borrow
          </Typography>
          <Typography variant="h6" color="stieglitz">
            Liquidity:
            <span className="text-white ml-1">
              {` $${formatAmount(totalSupply, 2, true)}`}
            </span>
          </Typography>
        </Box>
      </Box>
      <Box className="bg-umbra rounded-xl">
        <Input
          size="small"
          variant="default"
          type="number"
          placeholder="0.0"
          value={collatToDeposit}
          className="p-3"
          leftElement={
            <Box className="flex my-auto">
              <Box className="flex w-[6.2rem] mr-3 bg-cod-gray rounded-full space-x-2 p-1 pr-4">
                <img
                  src={`/images/tokens/${underlyingSymbol.toLowerCase()}.svg`}
                  alt="usdc"
                  className="h-8"
                />
                <Typography
                  variant="h5"
                  color="white"
                  className="flex items-center ml-2"
                >
                  {underlyingSymbol}
                </Typography>
              </Box>
            </Box>
          }
        />
        <Box className="flex justify-between pb-3 px-5 pt-0">
          <Typography variant="h6" color="stieglitz">
            Collateral
          </Typography>
          <Typography variant="h6" color="stieglitz">
            Balance:{' '}
            <span className="text-white ml-1">
              {`${formatAmount(
                getUserReadableAmount(underlyingBalance, DECIMALS_TOKEN),
                2
              )}`}
            </span>
          </Typography>
        </Box>
      </Box>
    </>
  );
};
