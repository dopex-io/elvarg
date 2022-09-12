import { useContext } from 'react';
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

import { DuelContext } from 'contexts/Duel';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import displayAddress from 'utils/general/displayAddress';
import formatAmount from 'utils/general/formatAmount';

import Countdown from 'react-countdown';

export const Duels = ({ findDuel }: { findDuel: Function }) => {
  const { duels, isLoading } = useContext(DuelContext);

  const onImgSrcError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src =
      'https://img.tofunft.com/v2/42161/0xede855ced3e5a59aaa267abdddb0db21ccfe5072/666/280/static.jpg';
  };

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
                      <span className="text-stieglitz">Action</span>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={cx('rounded-lg')}>
                {duels.map((duel, i) => (
                  <TableRow key={i} className="text-white mb-2 rounded-lg mt-2">
                    <TableCell align="left" className="mx-0 pt-2">
                      <Box className="flex">
                        <img
                          src={`https://img.tofunft.com/v2/42161/0xede855ced3e5a59aaa267abdddb0db21ccfe5072/${duel['duelist']}/280/static.jpg`}
                          alt={'Duelist'}
                          className="rounded-md w-12 h-12 mt-1 mr-1"
                          onError={onImgSrcError}
                        />
                        <Box>
                          <Typography
                            variant="h5"
                            className="font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-left text-white"
                          >
                            <span>
                              {displayAddress(duel['duelistAddress'])}
                            </span>
                          </Typography>
                          <Typography
                            variant="h5"
                            className="text-[#78859E] font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-left"
                          >
                            <span>Address</span>
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="left" className="pt-2">
                      <Typography variant="h5" className="font-['Minecraft']">
                        {displayAddress(duel['challengerAddress'])}
                      </Typography>
                    </TableCell>

                    <TableCell align="left" className="pt-2">
                      <Typography variant="h5" className="font-['Minecraft']">
                        <Countdown
                          date={duel['challengedLimitDate']}
                          renderer={({ days, hours, minutes, seconds }) => {
                            if (days < 1 && hours < 1) {
                              return (
                                <span>
                                  {minutes}m {seconds}s
                                </span>
                              );
                            } else {
                              return (
                                <span>
                                  {hours}h {minutes}m {seconds}s
                                </span>
                              );
                            }
                          }}
                        />
                      </Typography>
                    </TableCell>

                    <TableCell align="left" className="px-6 pt-2">
                      <Typography variant="h5" className="font-['Minecraft']">
                        #{duel['id']}
                      </Typography>
                    </TableCell>

                    <TableCell align="left" className="px-6 pt-2">
                      <Typography variant="h5" className="font-['Minecraft']">
                        {duel['wager']} {duel['tokenName']}
                      </Typography>
                      <Typography variant="h6" className="font-['Minecraft']">
                        <span className="text-stieglitz">
                          ~${formatAmount(duel['wagerValueInUSD'], 2)}
                        </span>
                      </Typography>
                    </TableCell>

                    <TableCell align="left" className="px-6 pt-2">
                      <CustomButton
                        size="medium"
                        className={styles['smallPepeButton']!}
                        disabled={duel['challengedLimitDate'] < new Date()}
                        onClick={() => findDuel(duel)}
                      >
                        <Typography
                          variant="h5"
                          className={styles['pepeButtonText']!}
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
        {duels.length == 0 && !isLoading ? (
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
