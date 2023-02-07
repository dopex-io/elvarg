import cx from 'classnames';

import Countdown from 'react-countdown';

import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

import { PepeButton } from 'components/nfts/components/PepeButton';
import PepeSimpleText from 'components/nfts/components/PepeSimpleText';
import Typography from 'components/UI/Typography';
import displayAddress from 'utils/general/displayAddress';
import formatAmount from 'utils/general/formatAmount';

import { useBoundStore } from 'store';

export const Duels = ({ findDuel }: { findDuel: Function }) => {
  const { duels } = useBoundStore();

  const onImgSrcError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src =
      'https://img.tofunft.com/v2/42161/0xede855ced3e5a59aaa267abdddb0db21ccfe5072/666/280/static.jpg';
  };

  return (
    <Box className={'bg-[#181C24] w-full p-4 pt-2 pb-4.5 pb-0 rounded-sm'}>
      <Box className="balances-table text-white">
        <TableContainer className={'bg-[#181C24]'}>
          {duels.length === 0 ? (
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
                {duels.map((duel, i) => {
                  const isAvailable =
                    duel['challengerAddress'] === '?' &&
                    duel['status'] !== 'requireUndo';
                  return (
                    <TableRow
                      key={i}
                      className="text-white mb-2 rounded-lg mt-2"
                    >
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
                        <PepeSimpleText
                          variant="h5"
                          text={displayAddress(duel['challengerAddress'])}
                        />
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
                        <PepeSimpleText variant="h5" text={'#' + duel['id']} />
                      </TableCell>
                      <TableCell align="left" className="px-6 pt-2">
                        <PepeSimpleText
                          variant="h5"
                          text={duel['wager'] + ' ' + duel['tokenName']}
                        />
                        <Typography variant="h6" className="font-['Minecraft']">
                          <span className="text-stieglitz">
                            ~${formatAmount(duel['wagerValueInUSD'], 2)}
                          </span>
                        </Typography>
                      </TableCell>
                      <TableCell align="left" className="px-6 pt-2">
                        <PepeButton
                          variant={'h3'}
                          text={'DUEL'}
                          action={() => findDuel(duel)}
                          disabled={!isAvailable}
                          className={''}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : null}
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Duels;
