import format from 'date-fns/format';
import Box from '@mui/material/Box';
import LaunchIcon from '@mui/icons-material/Launch';

import Typography from 'components/UI/Typography';

import formatAmount from 'utils/general/formatAmount';
import smartTrim from 'utils/general/smartTrim';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { OptionPoolBrokerTransaction } from 'types';

interface TradeHistorySmProps {
  finalTransactions: OptionPoolBrokerTransaction[];
  page: number;
  rowsPerPage: number;
}

const TradeHistorySm = (props: TradeHistorySmProps) => {
  const { finalTransactions, page, rowsPerPage } = props;

  return (
    <>
      {finalTransactions
        ? finalTransactions
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((txn, index) => {
              return (
                <Box
                  key={index}
                  className="flex flex-col bg-umbra mx-4 my-2 p-4 rounded-lg"
                >
                  <Box className="flex mb-4 justify-between">
                    <Typography variant="h5" className="my-auto">
                      {txn.isPut ? 'PUT' : 'CALL'}
                    </Typography>
                    <Box className="flex">
                      <Typography
                        variant="h5"
                        className="text-white my-auto self-end"
                      >
                        {txn.__typename}
                      </Typography>
                    </Box>
                  </Box>
                  <Box className="flex justify-between">
                    <Box className="flex flex-col text-stieglitz space-y-4">
                      <Typography
                        variant="h6"
                        className="text-stieglitz"
                        component="div"
                      >
                        Strike
                      </Typography>
                      <Typography
                        variant="h6"
                        className="text-stieglitz"
                        component="div"
                      >
                        Amount
                      </Typography>
                      <Typography
                        variant="h6"
                        className="text-stieglitz"
                        component="div"
                      >
                        Timestamp
                      </Typography>
                      <Typography
                        variant="h6"
                        className="text-stieglitz"
                        component="div"
                      >
                        Transaction
                      </Typography>
                      <Typography
                        variant="h6"
                        className="text-stieglitz"
                        component="div"
                      >
                        Block
                      </Typography>
                    </Box>
                    <Box className="flex flex-col space-y-4 text-right">
                      <Typography variant="h6" component="div">
                        $
                        {txn.__typename === 'OptionSwap'
                          ? formatAmount(
                              getUserReadableAmount(
                                txn.newStrike,
                                18
                              ).toString(),
                              3
                            )
                          : formatAmount(
                              getUserReadableAmount(txn.strike, 8).toString(),
                              3
                            )}
                      </Typography>
                      <Typography variant="h6" component="div">
                        {txn.__typename === 'OptionSwap'
                          ? formatAmount(
                              getUserReadableAmount(
                                txn.newAmount,
                                18
                              ).toString(),
                              3
                            )
                          : formatAmount(
                              getUserReadableAmount(txn.amount, 18).toString(),
                              3
                            )}
                      </Typography>
                      <Typography variant="h6" component="div">
                        {format(
                          Number(txn.transaction.timestamp) * 1000,
                          ' H:mm EEE d LLLL'
                        )}
                      </Typography>
                      <a
                        href={`https://testnet.arbiscan.io/tx/${txn.transaction.id}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-white flex space-x-2 items-center text-sm self-end"
                      >
                        <span>{smartTrim(txn.transaction.id, 8)}</span>
                        <LaunchIcon className="h-4 w-4 text-white" />
                      </a>
                      <a
                        href={`https://testnet.arbiscan.io/block/${txn.transaction.blockNumber}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-white flex space-x-2 items-center text-sm self-end"
                      >
                        <span>{txn.transaction.blockNumber}</span>
                        <LaunchIcon className="h-4 w-4 text-white" />
                      </a>
                    </Box>
                  </Box>
                </Box>
              );
            })
        : null}
    </>
  );
};

export default TradeHistorySm;
