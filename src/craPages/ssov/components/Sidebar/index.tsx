import { useMemo, useState } from 'react';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

import Typography from 'components/UI/Typography';
import WalletButton from 'components/WalletButton';
import CircleIcon from 'components/Icons/CircleIcon';
import InfoBox from '../InfoBox';
import EpochSelector from '../EpochSelector';
import PurchaseDialog from '../PurchaseDialog';

import useBnbSsovConversion from 'hooks/useBnbSsovConversion';

import Coin from 'assets/icons/Coin';
import Action from 'assets/icons/Action';

import { SsovData, SsovEpochData, SsovUserData } from 'contexts/Ssov';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { SSOV_MAP } from 'constants/index';
import ssovInfo from 'constants/ssovInfo';

import styles from './styles.module.scss';

const Sidebar = ({}: {}) => {
  return (
    <Box className={'absolute w-[21rem]'}>
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
          <Box className={'bg-[#2D2D2D] p-2 pr-3.5 pl-3.5 rounded-md mr-3'}>
            <Typography variant="h4" className="text-stieglitz">
              6
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
            <Typography variant="h5" className="text-white ml-auto">
              2d 12h 11m
            </Typography>
          </Box>
          <Box className={'flex mt-1'}>
            <Typography variant="h5" className="text-stieglitz">
              Next epoch
            </Typography>
            <Typography variant="h5" className="text-white ml-auto">
              23/2/2022
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
      <Box className="rounded-md flex mb-4 p-3 border border-neutral-800 w-full bg-umbra">
        <img src={'/assets/magic.svg'} className={'w-5 h-4 mt-0.5 mr-3'} />
        <Typography variant="h6" className="text-white">
          Vault
        </Typography>
      </Box>
      <Box className="rounded-md flex mb-4 p-3 w-full">
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
      <Box className={'bg-[#2D364D] rounded-md relative'}>
        <img src={'/assets/arbitrum-full.svg'} className={'h-11'} />
        <Box
          className={
            'absolute right-[10px] top-[7px] bg-umbra p-2 pt-1.5 pb-1.5 rounded-md'
          }
        >
          <Typography variant="h5" className="text-white text-sm">
            x0123...dfb
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
