import Link from 'next/link';

import { BigNumber } from 'ethers';

import { Box, TableRow } from '@mui/material';
import { IOlpApi } from 'pages/olp';

import { CustomButton, NumberDisplay, Typography } from 'components/UI';
import {
  StyleCell,
  StyleLeftCell,
  StyleRightCell,
} from 'components/common/LpCommon/Table';

import { CHAINS } from 'constants/chains';

export const OlpTableRow = ({ olp, idx }: { olp: IOlpApi; idx: number }) => {
  const splitSymbol = olp.symbol.split('-');
  return (
    <TableRow key={idx} className="text-white mb-2 rounded-lg">
      <StyleLeftCell align="left">
        <Box className="flex flex-row items-center w-max">
          <Box className="w-7 h-7 border border-gray-500 rounded-full mr-2">
            <img
              src={`/images/tokens/${olp.underlyingSymbol.toLowerCase()}.svg`}
              alt={olp.underlyingSymbol}
            />
          </Box>
          <Typography variant="h6" color="white" className="capitalize">
            {`${splitSymbol[0]} ${splitSymbol[1]?.toLowerCase()}`}
          </Typography>
        </Box>
      </StyleLeftCell>
      <StyleCell align="left">
        <Typography variant="h6" color="white">
          $
          <NumberDisplay n={BigNumber.from(olp.tvl)} decimals={0} />
        </Typography>
      </StyleCell>
      <StyleCell align="left">
        <Typography variant="h6" color="white">
          $
          <NumberDisplay n={BigNumber.from(olp.utilization)} decimals={0} />
        </Typography>
        <Typography variant="h6" color="stieglitz">
          {olp.tvl === 0 ? '0' : Math.round((olp.utilization / olp.tvl) * 100)}%
        </Typography>
      </StyleCell>
      <StyleCell align="left">
        <Typography variant="h6" color="white" className="capitalize">
          <img
            src={CHAINS[olp.chainId]?.icon}
            alt={CHAINS[olp.chainId]?.name}
            className="w-6 h-auto"
          />
        </Typography>
      </StyleCell>
      <StyleRightCell align="right" className="pt-2">
        <CustomButton className="cursor-pointer text-white">
          <Link href={`/olp/${olp.symbol}`} passHref target="_blank">
            View
          </Link>
        </CustomButton>
      </StyleRightCell>
    </TableRow>
  );
};
