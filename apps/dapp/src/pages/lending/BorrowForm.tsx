import { BigNumber } from 'ethers';
import { Box } from '@mui/material';

import { Typography, Input } from 'components/UI';

import { getUserReadableAmount } from 'utils/contracts';
import { formatAmount } from 'utils/general';
import { DECIMALS_TOKEN } from 'constants/index';

interface BorrowFormProps {
  borrowAmount: string | number;
  underlyingSymbol: string;
  onChange: (e: {
    target: {
      value: React.SetStateAction<string | number>;
    };
  }) => void;
  handleMax: () => void;
  underlyingBalance: BigNumber;
  usdToReceive: number;
  totalSupply: number;
}

export const BorrowForm = ({
  borrowAmount,
  underlyingSymbol,
  onChange,
  handleMax,
  underlyingBalance,
  usdToReceive,
  totalSupply,
}: BorrowFormProps) => {
  return (
    <>
      <Box className="bg-umbra rounded-xl">
        <Input
          size="small"
          variant="default"
          type="number"
          placeholder="0.0"
          value={borrowAmount}
          onChange={onChange}
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
              <Box
                role="button"
                className="rounded-md bg-mineshaft text-stieglitz hover:bg-mineshaft my-auto p-2"
                onClick={handleMax}
              >
                <Typography variant="caption" color="stieglitz">
                  MAX
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
            {`${formatAmount(
              getUserReadableAmount(underlyingBalance, DECIMALS_TOKEN),
              2
            )}`}
          </Typography>
        </Box>
      </Box>
      <Box className="bg-umbra rounded-xl">
        <Input
          size="small"
          variant="default"
          type="number"
          placeholder="0.0"
          value={usdToReceive}
          disabled
          sx={{
            '& input.MuiInputBase-input': {
              '-webkit-text-fill-color': 'white',
              overflowX: 'true',
              padding: '0',
            },
          }}
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
            <span className="text-white">
              {` $${formatAmount(totalSupply, 2, true)}`}
            </span>
          </Typography>
        </Box>
      </Box>
    </>
  );
};
