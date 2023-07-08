import { useMemo } from 'react';
import { ethers } from 'ethers';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';

import { useBoundStore } from 'store';
import { StakingRewards } from 'store/Vault/ssov';

import { NumberDisplay } from 'components/UI';
import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const contracts = [
  {
    name: 'Option vault',
    value: '0x............................23',
  },
  {
    name: 'Option vault LP',
    value: '0x............................23',
  },
  {
    name: 'Inu 20',
    value: '0x............................23',
  },
];

const stats = [
  {
    name: 'Volume',
    value: '$1.000.000',
  },
  {
    name: 'Utilization',
    value: '50%',
  },
  {
    name: 'Fees',
    value: '0.05%',
  },
];

const apys = [
  {
    name: 'Base (Inu)',
    value: '5%',
  },
  {
    name: 'Base (Puts)',
    value: '2%',
  },
  {
    name: 'Rewards (Puts)',
    value: '5%',
  },
];

const sections = [
  {
    name: 'Contracts',
    fields: contracts,
  },
  {
    name: 'Stats',
    fields: stats,
  },
  {
    name: 'APY',
    fields: apys,
  },
];

const Stats = (props: { className?: string }) => {
  const { className } = props;

  const { selectedEpoch } = useBoundStore();

  return Number(selectedEpoch) > 0 ? (
    <Box className={cx('bg-cod-gray w-full p-6 rounded-xl', className)}>
      {sections.map((section) => (
        <div>
          <Box className="flex flex-row justify-between mb-1">
            <Typography variant="h5" className="text-stieglitz">
              {section.name}
            </Typography>
          </Box>
          <Box className="balances-table text-white pb-4">
            <TableContainer className="bg-cod-gray">
              <Table className="border-separate border-spacing-y-2">
                <TableHead className="bg-umbra">
                  {section.fields.map((field) => (
                    <TableRow className="bg-umbra">
                      <TableCell
                        align="left"
                        className="text-stieglitz bg-cod-gray border-0 p-2 w-[24rem]"
                      >
                        <Typography variant="h6" className="!text-stieglitz">
                          {field.name}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="left"
                        className="text-stieglitz bg-cod-gray border-0 pb-0"
                      >
                        <Typography variant="h6" className="text-stieglitz">
                          {field.value}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableHead>
              </Table>
            </TableContainer>
          </Box>
        </div>
      ))}
    </Box>
  ) : null;
};

export default Stats;
