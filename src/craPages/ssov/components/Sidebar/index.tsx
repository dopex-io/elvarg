import { useContext } from 'react';
import { Addresses } from '@dopex-io/sdk';
import Countdown from 'react-countdown';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

import Typography from 'components/UI/Typography';
import CircleIcon from 'components/Icons/CircleIcon';

import { SsovContext } from 'contexts/Ssov';
import { WalletContext } from 'contexts/Wallet';

import displayAddress from 'utils/general/displayAddress';
import getExtendedLogoFromChainId from 'utils/general/getExtendedLogoFromChainId';
import getExplorerUrl from 'utils/general/getExplorerUrl';
import getFormattedDate from 'utils/date/getFormattedDate';

import styles from './styles.module.scss';

export interface Props {
  asset: string;
  activeSsovContextSide: string;
  activeView: string;
  setActiveView: Function;
}

const Sidebar = ({
  asset,
  activeSsovContextSide,
  activeView,
  setActiveView,
}: Props) => {
  const ssovContext = useContext(SsovContext);
  const { chainId } = useContext(WalletContext);

  return (
    <Box className={'absolute w-[20rem]'}>
      <Box className={'flex'}>
        <Typography variant="h5" className="text-stieglitz">
          Epoch
        </Typography>
      </Box>
      <Box className={'bg-cod-gray sm:px-4 px-2 py-4 rounded-xl mt-5'}>
        <Box className={'flex'}>
          <Box className={'bg-[#2D2D2D] p-1 pr-3.5 pl-3.5 rounded-md mr-3'}>
            <Typography variant="h4" className="text-stieglitz">
              {ssovContext[activeSsovContextSide].ssovData.currentEpoch}
            </Typography>
          </Box>
          <Button className={styles.button}>
            <img src={'/assets/lock.svg'} className={'mr-3'} /> Vault Open
          </Button>
          {/*<Box className={'bg-[#2D2D2D] p-2 pr-4 pl-4 rounded-md ml-auto'}>
            <img src={'/assets/threedots.svg'} className={'h-4 mt-[6px]'} />
          </Box>*/}
        </Box>
        <Box className={'bg-[#2D2D2D] p-3 rounded-md mt-3'}>
          <Box className={'flex'}>
            <Typography variant="h5" className="text-stieglitz">
              Time remaining
            </Typography>
            <Countdown
              date={
                new Date(
                  ssovContext[
                    activeSsovContextSide
                  ].ssovEpochData.epochTimes[1].toNumber() * 1000
                )
              }
              renderer={({ days, hours, minutes, seconds }) => {
                return (
                  <Typography variant="h5" className="text-white ml-auto">
                    {days}d {hours}h {minutes}m
                  </Typography>
                );
              }}
            />
          </Box>
          <Box className={'flex mt-1'}>
            <Typography variant="h5" className="text-stieglitz">
              Next epoch
            </Typography>
            <Typography variant="h5" className="text-white ml-auto">
              {getFormattedDate(
                new Date(
                  (ssovContext[
                    activeSsovContextSide
                  ].ssovEpochData.epochTimes[1].toNumber() +
                    86400 * 3) *
                    1000
                )
              )}
            </Typography>
          </Box>
        </Box>
        <Box className={'flex mt-6'}>
          <CircleIcon
            onClick={null}
            className={
              'ml-auto mr-auto h-5 w-5 fill-white stroke-white cursor-pointer'
            }
          />
          {/*
          <CircleIcon
            onClick={null}
            className={
              'mr-auto ml-0 h-5 w-5 fill-gray-800 stroke-gray-100 opacity-10 cursor-pointer'
            }
          />
          */}
        </Box>
      </Box>
      <Box className={'flex mt-8 mb-3'}>
        <Typography variant="h5" className="text-stieglitz">
          Views
        </Typography>
      </Box>
      <Box className="rounded-md flex mb-4 p-3 border border-neutral-800 w-full bg-umbra cursor-pointer">
        <img src={'/assets/magicstars.svg'} className={'w-5 h-4 mt-0.5 mr-3'} />
        <Typography variant="h6" className="text-white">
          Vault
        </Typography>
      </Box>
      <Box className="rounded-md flex mb-4 p-3 w-full group cursor-pointer hover:border hover:border-neutral-800 hover:bg-umbra">
        <img src={'/assets/stars.svg'} className={'w-5 h-4 mt-0.5 mr-3'} />
        <Typography variant="h6" className="text-stieglitz">
          Options & Positions
        </Typography>
      </Box>
      <Box className={'mt-8 mb-3'}>
        <Typography variant="h5" className="text-stieglitz">
          Contract
        </Typography>
      </Box>
      <Box className={`bg-umbra rounded-md relative`}>
        <img src={getExtendedLogoFromChainId(chainId)} className={'h-11 p-1'} />
        <Box
          className={
            'absolute right-[10px] top-[8px] bg-mineshaft p-2 pt-1 pb-1 rounded-md'
          }
        >
          <a
            className={'cursor-pointer'}
            href={`${getExplorerUrl(chainId)}/address/${
              Addresses[chainId][
                activeSsovContextSide === 'CALL' ? 'SSOV' : '2CRV-SSOV-P'
              ][asset]['Vault']
            }`}
          >
            <Typography variant="h5" className="text-white text-[11px]">
              {displayAddress(
                Addresses[chainId][
                  activeSsovContextSide === 'CALL' ? 'SSOV' : '2CRV-SSOV-P'
                ][asset]['Vault'],
                null
              )}
            </Typography>
          </a>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
