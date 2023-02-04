import { BigNumber } from 'ethers';
import Link from 'next/link';
import { Box, TableRow } from '@mui/material';

import { Typography, CustomButton, NumberDisplay } from 'components/UI';
import {
  StyleLeftCell,
  StyleCell,
  StyleRightCell,
} from 'components/common/LpCommon/Table';
import { CHAIN_ID_TO_NETWORK_DATA } from 'constants/index';

import { IOlpApi } from 'pages/olp';

export const AssetTableRow = ({ f, idx }: { f: IOlpApi; idx: number }) => {
  const splitSymbol = f.symbol.split('-');

  return (
    <TableRow key={idx} className="text-white mb-2 rounded-lg">
      <StyleLeftCell align="left">
        <Box className="flex flex-row items-center w-max">
          <Box className="w-7 h-7 border border-gray-500 rounded-full mr-2">
            <img
              src={`/images/tokens/${f.underlyingSymbol.toLowerCase()}.svg`}
              alt={f.underlyingSymbol}
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
          <NumberDisplay n={BigNumber.from(f.tvl)} decimals={0} />
        </Typography>
      </StyleCell>
      <StyleCell align="left">
        <Typography variant="h6" color="white">
          $
          <NumberDisplay n={BigNumber.from(f.utilization)} decimals={0} />
        </Typography>
        <Typography variant="h6" color="stieglitz">
          {f.tvl === 0 ? '0' : Math.round((f.utilization / f.tvl) * 100)}%
        </Typography>
      </StyleCell>
      <StyleCell align="left">
        <Typography variant="h6" color="white" className="capitalize">
          <img
            src={CHAIN_ID_TO_NETWORK_DATA[f.chainId]?.icon}
            alt={CHAIN_ID_TO_NETWORK_DATA[f.chainId]?.name}
            className="w-6 h-6"
          />
        </Typography>
      </StyleCell>
      <StyleRightCell align="right" className="pt-2">
        <CustomButton className="cursor-pointer text-white">
          <Link href={`/olp/${f.symbol}`} passHref target="_blank">
            View
          </Link>
        </CustomButton>
      </StyleRightCell>
    </TableRow>
  );
};
