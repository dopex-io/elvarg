import { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import cx from 'classnames';
import Head from 'next/head';
import {
  Addresses,
  Tzwap1inchRouter__factory,
  ERC20__factory,
} from '@dopex-io/sdk';
import { LoaderIcon } from 'react-hot-toast';
import Countdown from 'react-countdown';
import { BigNumber } from 'ethers';

import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import useSendTx from 'hooks/useSendTx';

import Kill from 'components/tzwap/Dialogs/Kill';
import Orders from 'components/tzwap/Orders';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import AppBar from 'components/common/AppBar';
import TokenSelector from 'components/common/TokenSelector';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';

import formatAmount from 'utils/general/formatAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import get1inchQuote from 'utils/general/get1inchQuote';
import displayAddress from 'utils/general/displayAddress';

import RedTriangleIcon from 'svgs/icons/RedTriangleIcon';

import { AssetsContext, IS_NATIVE } from 'contexts/Assets';
import { WalletContext } from 'contexts/Wallet';

import { CURRENCIES_MAP, MAX_VALUE } from 'constants/index';

import { Order } from '../../types/tzwap';

import styles from './styles.module.scss';
import Sidebar from '../../components/portfolio/Sidebar';
import Positions from '../../components/portfolio/Positions';

const SelectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 324,
      width: 250,
    },
  },
  classes: {
    paper: 'bg-mineshaft',
  },
};

const Portfolio = () => {
  return (
    <Box className="bg-[url('/assets/vaults-background.png')] bg-left-top bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>Portfolio | Dopex</title>
      </Head>
      <AppBar />
      <Box
        className="py-12 lg:max-w-full md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 lg:grid lg:grid-cols-12"
        gap={0}
      >
        <Box className="ml-10 mt-20 hidden lg:block lg:col-span-2">
          <Sidebar />
        </Box>

        <Box gridColumn="span 10" className="mt-10 lg:mb-20 lg:pl-5 lg:pr-5">
          <Positions />
        </Box>
      </Box>
    </Box>
  );
};

export default Portfolio;
