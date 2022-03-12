import { useMemo, useState, useContext } from 'react';
import { Addresses } from '@dopex-io/sdk';
import Countdown from 'react-countdown';
import cx from 'classnames';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

import Typography from 'components/UI/Typography';
import WalletButton from 'components/WalletButton';
import CircleIcon from 'components/Icons/CircleIcon';
import InfoBox from '../InfoBox';
import EpochSelector from '../EpochSelector';
import PurchaseDialog from '../PurchaseDialog';

import Coin from 'assets/icons/Coin';
import Action from 'assets/icons/Action';

import {
  SsovContext,
  SsovData,
  SsovEpochData,
  SsovUserData,
} from 'contexts/Ssov';
import { WalletContext } from 'contexts/Wallet';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import displayAddress from 'utils/general/displayAddress';
import getFormattedDate from 'utils/date/getFormattedDate';

import { SSOV_MAP } from 'constants/index';
import ssovInfo from 'constants/ssovInfo';

import styles from './styles.module.scss';

export interface Props {
  asset: string;
  activeType: string;
}

const Sidebar = ({ asset, activeType }: Props) => {
  const ssovContext = useContext(SsovContext);
  const { chainId } = useContext(WalletContext);

  return (
    <Box className={'absolute w-[20rem]'}>
      <Box className={'flex'}>
        <Typography variant="h5" className="text-stieglitz">
          Epoch
        </Typography>
        <Box className={'flex  ml-auto'}>
          <Typography variant="h5" className="text-white">
            Weekly
          </Typography>
          <img
            src="/assets/arrowdown.svg"
            className={'w-[9px] h-[8px] mt-3 ml-3'}
          />
        </Box>
      </Box>
      <Box className={'bg-cod-gray sm:px-4 px-2 py-4 rounded-xl mt-5'}>
        <Box className={'flex'}>
          <Box className={'bg-[#2D2D2D] p-1 pr-3.5 pl-3.5 rounded-md mr-3'}>
            <Typography variant="h4" className="text-stieglitz">
              {ssovContext[activeType].ssovData.currentEpoch}
            </Typography>
          </Box>
          <Button className={styles.button}>
            <img src={'/assets/lock.svg'} className={'mr-3'} /> Vault Open
          </Button>
          <Box className={'bg-[#2D2D2D] p-2 pr-4 pl-4 rounded-md ml-auto'}>
            <img src={'/assets/threedots.svg'} className={'h-4 mt-[6px]'} />
          </Box>
        </Box>
        <Box className={'bg-[#2D2D2D] p-3 rounded-md mt-3'}>
          <Box className={'flex'}>
            <Typography variant="h5" className="text-stieglitz">
              Time remaining
            </Typography>
            {console.log(ssovContext)}
            <Countdown
              date={
                new Date(
                  ssovContext[
                    activeType
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
                    activeType
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
              'ml-auto mr-3 h-5 w-5 fill-white stroke-white cursor-pointer'
            }
          />
          <CircleIcon
            onClick={null}
            className={
              'mr-auto ml-0 h-5 w-5 fill-gray-800 stroke-gray-100 opacity-10 cursor-pointer'
            }
          />
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
      <Tooltip title={'Not available yet'}>
        <Box className="rounded-md flex mb-4 p-3 w-full group cursor-not-allowed">
          <img src={'/assets/stars.svg'} className={'w-5 h-4 mt-0.5 mr-3'} />
          <Typography variant="h6" className="text-stieglitz">
            Options & Positions
          </Typography>
        </Box>
      </Tooltip>
      <Box className={'mt-8 mb-3'}>
        <Typography variant="h5" className="text-stieglitz">
          Contract
        </Typography>
      </Box>
      <Box className={'bg-[#2D364D] rounded-md relative'}>
        <img src={'/assets/arbitrum-full.svg'} className={'h-11 p-1'} />
        <Box
          className={
            'absolute right-[10px] top-[8px] bg-umbra p-2 pt-1 pb-1 rounded-md'
          }
        >
          <a
            className={'cursor-pointer'}
            href={
              'https://arbiscan.io/address/' +
              Addresses[chainId][
                activeType === 'CALL' ? 'SSOV' : '2CRV-SSOV-P'
              ][asset]['Vault']
            }
          >
            <Typography variant="h5" className="text-white text-[11px]">
              {displayAddress(
                Addresses[chainId][
                  activeType === 'CALL' ? 'SSOV' : '2CRV-SSOV-P'
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
