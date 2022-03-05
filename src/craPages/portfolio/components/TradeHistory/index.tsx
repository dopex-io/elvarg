import React, {
  useContext,
  useState,
  useMemo,
  useLayoutEffect,
  useCallback,
} from 'react';
import { useWindowSize } from 'react-use';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TablePagination from '@mui/material/TablePagination';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CircularProgress from '@mui/material/CircularProgress';

import { PortfolioContext } from 'contexts/Portfolio';
import { WalletContext } from 'contexts/Wallet';

import TablePaginationActions from 'components/UI/TablePaginationActions';
import Typography from 'components/UI/Typography';
import TradeHistoryTable from './TradeHistoryTable';
import TradeHistorySm from './TradeHistorySm';

const TX_TYPES = {
  OptionPurchase: 'Purchase',
  OptionExercise: 'Exercise',
  OptionSwap: 'Swap',
  All: 'All',
};

const ROWS_PER_PAGE = 5;

const TradeHistory = () => {
  const { width } = useWindowSize();

  const { userTransactions } = useContext(PortfolioContext);
  const { accountAddress, connect } = useContext(WalletContext);

  const [selectedTxType, setSelectedTxType] = useState('All');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [page, setPage] = useState(0);

  const [smViewport, setSmViewport] = useState(false);

  useLayoutEffect(() => {
    width < 768 ? setSmViewport(true) : setSmViewport(false);
  }, [width, smViewport]);

  const handleClick = useCallback(() => {
    if (accountAddress === '') {
      connect();
    }
  }, [accountAddress, connect]);

  const finalTransactions = useMemo(() => {
    return userTransactions?.filter((tx) => {
      if (selectedTxType === 'All') return true;

      return tx.__typename === selectedTxType;
    });
  }, [userTransactions, selectedTxType]);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const rowsPerPage = useMemo(() => 5, []);

  return (
    <section className="bg-cod-gray rounded-lg box-border my-2 md:ml-1.5 md:mb-1.5 md:mr-2">
      <Box className="text-white">
        <Typography variant="h6" className="text-xl p-3 text-stieglitz">
          Trade History
        </Typography>
        <Box className="flex flex-col">
          <Box className="flex mb-3">
            <Button
              variant="text"
              className="pl-3 mx-4 bg-mineshaft text-white hover:bg-mineshaft hover:opacity-80 font-normal"
              onClick={handleClickListItem}
              disableRipple
            >
              {TX_TYPES[selectedTxType]}
              <KeyboardArrowDownRoundedIcon className="fill-white text-white" />
            </Button>
            <Menu
              id="tx-type-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              classes={{ paper: 'bg-umbra text-white' }}
            >
              {Object.keys(TX_TYPES).map((key) => {
                const onClick = () => {
                  setSelectedTxType(key);
                  handleClose();
                };

                return (
                  <MenuItem key={key} onClick={onClick}>
                    {TX_TYPES[key]}
                  </MenuItem>
                );
              })}
            </Menu>

            {!userTransactions ? (
              accountAddress ? (
                <CircularProgress className="p-2" />
              ) : (
                <Button
                  variant="text"
                  className="text-white bg-primary hover:bg-primary"
                  onClick={handleClick}
                >
                  Connect Wallet
                </Button>
              )
            ) : finalTransactions.length === 0 ? (
              <Box className="flex border border-umbra rounded-md py-2 px-1">
                <InfoOutlinedIcon className="fill-current text-mineshaft w-5 h-5" />
                <span className="bg-cod-gray text-stieglitz text-xs font-light px-1 my-auto">
                  No transactions to display
                </span>
              </Box>
            ) : (
              <></>
            )}
          </Box>
          {!smViewport ? (
            <TradeHistoryTable
              finalTransactions={finalTransactions}
              page={page}
              rowsPerPage={rowsPerPage}
            />
          ) : (
            <TradeHistorySm
              finalTransactions={finalTransactions}
              page={page}
              rowsPerPage={rowsPerPage}
            />
          )}
        </Box>
        {userTransactions?.length > rowsPerPage ? (
          <TablePagination
            component="div"
            rowsPerPageOptions={[]}
            count={finalTransactions?.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={ROWS_PER_PAGE}
            className="text-stieglitz border-0 flex flex-grow justify-center"
            ActionsComponent={TablePaginationActions}
          />
        ) : null}
      </Box>
    </section>
  );
};

export default TradeHistory;
