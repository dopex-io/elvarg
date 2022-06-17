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
import CustomButton from 'components/UI/CustomButton';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import Countdown from 'react-countdown';
import React from 'react';

const Duels = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [duels, setDuels] = useState<{ [key: string]: any }[]>([1]);

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
                    className="bg-[#181C24] border-0 pb-0"
                  >
                    <Typography variant="h6">
                      <span className="text-stieglitz">Duelist</span>
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="bg-[#181C24] border-0 pb-0"
                  >
                    <Typography variant="h6">
                      <span className="text-stieglitz">Opponent</span>
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="bg-[#181C24] border-0 pb-0"
                  >
                    <Typography variant="h6">
                      <span className="text-stieglitz">Expiry In</span>
                    </Typography>
                  </TableCell>

                  <TableCell
                    align="left"
                    className="bg-[#181C24] border-0 pb-0"
                  >
                    <Typography variant="h6">
                      <span className="text-stieglitz">Duel ID</span>
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="bg-[#181C24] border-0 pb-0"
                  >
                    <Typography variant="h6">
                      <span className="text-stieglitz">Wager</span>
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="bg-[#181C24] border-0 pb-0"
                  >
                    <Typography variant="h6">
                      <span className="text-stieglitz">Head</span>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={cx('rounded-lg')}>
                {/* @ts-ignore TODO: FIX */}
                {duels.map((duel, i) => (
                  <TableRow key={i} className="text-white mb-2 rounded-lg mt-2">
                    <TableCell align="left" className="mx-0 pt-2">
                      <Box className="flex">
                        <img
                          src={`https://img.tofunft.com/v2/42161/0xede855ced3e5a59aaa267abdddb0db21ccfe5072/633/280/static.jpg`}
                          className="rounded-md w-12 h-12 mt-1 mr-1"
                        />
                        <Box>
                          <Typography
                            variant="h5"
                            className="font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-left text-white"
                          >
                            <span>#677</span>
                          </Typography>
                          <Typography
                            variant="h5"
                            className="text-[#78859E] font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-center"
                          >
                            <span>Diamond Pepe</span>
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="left" className="pt-2">
                      <Typography variant="h5" className="font-['Minecraft']">
                        0X013A
                      </Typography>
                    </TableCell>

                    <TableCell align="left" className="pt-2">
                      <Typography variant="h5" className="font-['Minecraft']">
                        11H 11M 11S
                      </Typography>
                    </TableCell>

                    <TableCell align="left" className="px-6 pt-2">
                      <Typography variant="h5" className="font-['Minecraft']">
                        #234
                      </Typography>
                    </TableCell>

                    <TableCell align="left" className="px-6 pt-2">
                      <Typography variant="h5" className="font-['Minecraft']">
                        1234.4 USDC
                      </Typography>
                      <Typography variant="h6" className="font-['Minecraft']">
                        <span className="text-stieglitz">~$1341.23</span>
                      </Typography>
                    </TableCell>

                    <TableCell align="left" className="px-6 pt-2">
                      <CustomButton
                        size="medium"
                        className={styles['smallPepeButton']}
                      >
                        {/* @ts-ignore TODO: FIX */}
                        <Typography
                          variant="h5"
                          className={styles['pepeButtonText']}
                        >
                          DUEL
                        </Typography>
                      </CustomButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </TableContainer>
        {duels.length == 0 ? (
          <Box className="text-stieglitz text-center pt-8 pb-9">
            <Typography variant="h6" className="text-white font-['Minecraft']">
              No active duels to show
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default Duels;
