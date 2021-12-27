import { useState, useCallback } from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import Input from 'components/UI/Input';
import ErrorBox from 'components/ErrorBox';
import InfoPopover from 'components/UI/InfoPopover';
import smartTrim from 'utils/general/smartTrim';

interface TradeProps {
  open: boolean;
  handleClose: () => void;
  price: string;
  amount: string;
  optionSymbol: string;
  username: string;
  address: string;
  isBuy: boolean;
}

const Trade = ({
  open,
  handleClose,
  price,
  amount,
  optionSymbol,
  username,
  address,
  isBuy,
}: TradeProps) => {
  const [approved, setApproved] = useState(false);

  const handleTrade = useCallback(() => {
    console.log('handle trade');
    /// TODO: Handle transfer of USDT to recepient address via escrow
  }, []);

  const handleApprove = useCallback(() => {
    /// TODO: Handle approval of USDT allowance spending by escrow contract
    setApproved(!approved);
  }, [approved]);

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Box className="flex flex-col space-y-4">
        <Box className="space-y-4">
          <>
            <Box className="flex flex-col space-y-3">
              <Typography variant="h5" className="text-stieglitz">
                Trade
              </Typography>
              <Box className="flex m-2 space-x-2">
                <Typography variant="caption" className="text-stieglitz">
                  USDT Balance:
                </Typography>
                <Typography variant="caption">412.212</Typography>
              </Box>
              <Box className="flex flex-col space-y-2 bg-umbra p-3 rounded-xl">
                <Box className="flex justify-between space-x-2 my-auto">
                  <Typography variant="h6" className="text-stieglitz">
                    Option
                  </Typography>
                  <Typography variant="h6">{optionSymbol}</Typography>
                </Box>
                <Box className="flex justify-between space-x-2 my-auto">
                  <Typography variant="h6" className="text-stieglitz">
                    Amount
                  </Typography>
                  <Typography variant="h6">{amount}</Typography>
                </Box>
                <Box className="flex justify-between space-x-2 my-auto">
                  <Typography variant="h6" className="text-stieglitz">
                    Ask Price
                  </Typography>
                  <Typography variant="h6">{price}</Typography>
                </Box>
                <Box className="flex justify-between space-x-2 my-auto">
                  <Typography variant="h6" className="text-stieglitz">
                    Dealer Address
                  </Typography>
                  <Typography variant="h6">{smartTrim(address, 10)}</Typography>
                </Box>
                <Box className="flex justify-between space-x-2 my-auto">
                  <Typography variant="h6" className="text-stieglitz">
                    Username
                  </Typography>
                  <Typography variant="h6">{username}</Typography>
                </Box>
              </Box>
            </Box>
            <Box>
              <ErrorBox error={'Error Message'} />
            </Box>
            <Box className="flex space-x-2">
              <CustomButton
                size="large"
                className="flex w-1/2"
                disabled={!approved}
                onClick={handleTrade}
              >
                Trade
              </CustomButton>
              <CustomButton
                size="large"
                className="flex w-1/2"
                disabled={approved}
                onClick={handleApprove}
              >
                Approve
              </CustomButton>
            </Box>
          </>
        </Box>
      </Box>
    </Dialog>
  );
};

export default Trade;
