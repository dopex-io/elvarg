import { useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import { BigNumber } from 'ethers';

import { useBoundStore } from 'store';

import { Typography } from 'components/UI';

import formatAmount from 'utils/general/formatAmount';

import { ExpiryBox, PriceBox } from './TopBar';

interface Props {
  data: string;
  isBeta: boolean;
  underlyingSymbol: string;
  tokenPrice: number;
  isEpochExpired: boolean;
}

const LpTopBar = ({
  data,
  isBeta,
  underlyingSymbol,
  tokenPrice,
  isEpochExpired,
}: Props) => {
  const {
    olpData,
    updateOlpEpochData,
    updateOlpUserData,
    setSelectedEpoch,
  } = useBoundStore();

  const handleSelectChange = useCallback(
    async (e: { target: { value: any } }) => {
      if (setSelectedEpoch) {
        setSelectedEpoch(Number(e.target.value));
        await updateOlpEpochData();
        await updateOlpUserData();
      }
    },
    [setSelectedEpoch, updateOlpUserData, updateOlpEpochData]
  );

  return (
    <Box className="flex flex-row border border-umbra bg-cod-gray border-radius rounded-lg">
      <Box className="w-1/2 flex justify-between py-1 px-2 pl-0">
        <Box className="flex items-center">
          <Box sx={{ p: 1 }} className="flex -space-x-4">
            <img
              className="w-8 h-8 z-10 border border-gray-500 rounded-full"
              src={`/images/tokens/${underlyingSymbol?.toLowerCase()}.svg`}
              alt={underlyingSymbol}
            />
            <img
              className="w-8 h-8 z-0"
              src="/images/tokens/usdc.svg"
              alt="USDC"
            />
          </Box>
          <Box className="ml-1">
            <Typography variant="h6">{data}</Typography>
            <Typography variant="h6" className="text-gray-500">
              {underlyingSymbol}
            </Typography>
          </Box>
        </Box>
        {isBeta && (
          <Typography
            variant="h6"
            className="mt-1.5 bg-primary rounded-lg p-2 font-bold h-[fit-content] mr-3"
          >
            BETA
          </Typography>
        )}
      </Box>

      <Box className="w-1/2 px-2">
        <ExpiryBox
          items={olpData?.expiries!}
          itemIndex={0}
          setItemIndex={handleSelectChange}
        />
      </Box>

      <PriceBox price={123} delta={1.23} />
    </Box>
  );
};

export default LpTopBar;
