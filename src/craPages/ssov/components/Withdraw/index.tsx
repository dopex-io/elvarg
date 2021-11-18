import { useCallback, useMemo, useState } from 'react';

import { Box, Input } from '@material-ui/core';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import Dialog from 'components/UI/Dialog';

import { STAT_NAMES } from 'constants/index';
import { format } from 'date-fns';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

const Withdraw = ({ open, handleClose }) => {
  const stats = useMemo(() => {
    return {
      strike: '$' + getUserReadableAmount(1, 8).toString(), // data.strike
      price: '$' + getUserReadableAmount(1, 8).toString(), // data.assetPrice
      pnl: '$' + formatAmount(1, 2), // data.pnl
      expiry: format(
        new Date(Number(1634639094) * 1000),
        'd LLL yyyy'
      ).toLocaleUpperCase(), // Date(Number(data.expiry))
      amount: formatAmount(0.1, 5), // data.userBalance
    };
  }, []); // data, optionsAmount
  const [amount, setAmount] = useState('');

  const handleWithdraw = useCallback(() => {}, []);

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Box className="flex flex-col">
        <Typography variant="h5" className="mb-3">
          Disable Auto Exercise
        </Typography>
        <Box className="flex flex-col bg-umbra rounded-lg p-4">
          <Box className="flex mb-4">
            {/* <img
            src={`/static/svg/tokens/dpx.svg`}
            alt="Symbol"
            className="w-8 h-8 my-auto"
          /> */}
            <span className="my-auto px-2 text-white">{'DPX'}</span>
            {/* data.asset */}
            <span className="text-xs text-white bg-mineshaft rounded-md my-auto ml-2 p-2">
              {/* {data.isPut ? 'PUT' : 'CALL'} */}
              {'CALL'}
            </span>
          </Box>
          <Box className="p-2 rounded-lg flex flex-col text-white">
            <Box className="flex flex-col space-y-4">
              {Object.keys(stats).map((key) => {
                return (
                  <Box key={key} className="flex justify-between">
                    <Typography
                      variant="caption"
                      component="div"
                      className="text-stieglitz"
                    >
                      {STAT_NAMES.exercise[key]}
                    </Typography>
                    <Typography variant="caption" component="div">
                      {stats[key]}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
        <Typography
          variant="h6"
          className="text-wave-blue uppercase mt-2 mb-1 ml-1"
          role="button"
          onClick={() => {}}
          // handleMax
        >
          Max
        </Typography>
        <Box className="bg-umbra flex flex-row p-4 rounded-xl justify-between mb-4">
          <Input
            disableUnderline={true}
            id="amount"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            className="h-8 text-sm text-white font-mono w-full"
            placeholder="Amount"
          />
        </Box>
        <Typography variant="caption" className="px-3 mb-3 text-red-400">
          {'error'}
        </Typography>
        <Box className="flex">
          <CustomButton
            size="large"
            //   disabled={
            //     blockTime > (Number(data.expiry) - 3600) * 1000 ||
            //     !amount ||
            //     Number(amount) === 0
            //   }
            onClick={handleWithdraw}
            className="w-full p-5 bottom-0 rounded-md ml-0.5"
          >
            Disable
          </CustomButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default Withdraw;
