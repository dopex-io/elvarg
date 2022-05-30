import { useState } from 'react';
import cx from 'classnames';

import styles from '../styles.module.scss';

import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';

import Typography from 'components/UI/Typography';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import Countdown from 'react-countdown';
import React from 'react';

const Duels = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [duels, setDuels] = useState<any[]>([]);

  return (
    <Box className={'bg-[#181C24] w-full p-4 pt-2 pb-4.5 pb-0 rounded-sm'}>
      <Box className="balances-table text-white">
        <TableContainer className={cx(styles['optionsTable'], 'bg-[#181C24]')}>
          {isLoading ? (
            <Box>
              <Box className={cx('rounded-lg text-center mt-1')}>
                <CircularProgress size={25} className={'mt-10'} />
                <Typography
                  variant="h6"
                  className="text-white mb-10 mt-2 font-['Minecraft']"
                >
                  Retrieving duels...
                </Typography>
              </Box>
            </Box>
          ) : duels.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="left"
                    className="text-stieglitz bg-[#181C24] border-0 pb-0"
                  >
                    <Typography variant="h6">Duelist</Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="text-stieglitz bg-[#181C24] border-0 pb-0"
                  >
                    <Typography variant="h6" className="text-stieglitz">
                      Opponent
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="text-stieglitz bg-[#181C24] border-0 pb-0"
                  >
                    <Typography variant="h6" className="text-stieglitz">
                      Expiry In
                    </Typography>
                  </TableCell>

                  <TableCell
                    align="left"
                    className="text-stieglitz bg-[#181C24] border-0 pb-0"
                  >
                    <Typography variant="h6" className="text-stieglitz">
                      Type
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="text-stieglitz bg-[#181C24] border-0 pb-0"
                  >
                    <Typography variant="h6" className="text-stieglitz">
                      Duel ID
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="text-stieglitz bg-[#181C24] border-0 pb-0"
                  >
                    <Typography variant="h6" className="text-stieglitz">
                      Wager
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="text-stieglitz bg-[#181C24] border-0 pb-0"
                  >
                    <Typography variant="h6" className="text-stieglitz">
                      Head
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={cx('rounded-lg')}></TableBody>
            </Table>
          ) : null}
        </TableContainer>
        {duels.length == 0 ? (
          <Box className="text-stieglitz text-center pt-8 pb-9">
            <Typography variant="h6" className="text-white font-['Minecraft']">
              Your duels will appear here
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default Duels;
