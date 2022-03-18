import {
  useContext,
  useState,
  useMemo,
  useCallback,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
import { BigNumber, ethers } from 'ethers';
import delay from 'lodash/delay';
import cx from 'classnames';
import Box from '@mui/material/Box';
import Countdown from 'react-countdown';
import TableHead from '@mui/material/TableHead';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import Skeleton from '@mui/material/Skeleton';
import Checkbox from '@mui/material/Checkbox';
import RefreshIcon from '@mui/icons-material/Refresh';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';

import Typography from 'components/UI/Typography';
import TablePaginationActions from 'components/UI/TablePaginationActions';

import {
  SsovData,
  SsovEpochData,
  SsovUserData,
  SsovContext,
} from 'contexts/Ssov';

import { BnbConversionContext } from 'contexts/BnbConversion';
import { WalletContext } from 'contexts/Wallet';

import { SSOV_MAP } from 'constants/index';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import displayAddress from 'utils/general/displayAddress';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import styles from './styles.module.scss';

const YEAR_SECONDS = 31536000;

const PurchaseOptions = ({
  activeContextSide,
  setActiveContextSide,
  setStrikeIndex,
}: {
  activeContextSide: string;
  setActiveContextSide: Dispatch<SetStateAction<string>>;
  setStrikeIndex: Dispatch<SetStateAction<number>>;
}) => {
  return <Box>Test</Box>;
};

export default PurchaseOptions;
