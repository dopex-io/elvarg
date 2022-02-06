import { useCallback, useEffect, useContext, useState } from 'react';
// import { useFormik } from 'formik';
// import noop from 'lodash/noop';
// import * as yup from 'yup';
import Box from '@material-ui/core/Box';
import { collection, getDocs, query, where } from 'firebase/firestore';
// import Input from '@material-ui/core/Input';

import Typography from 'components/UI/Typography';
import Dialog from 'components/UI/Dialog';
import CustomButton from 'components/UI/CustomButton';

import { WalletContext } from 'contexts/Wallet';

import { db } from 'utils/firebase/initialize';

const CloseRfqDialog = ({ open, handleClose, data }) => {
  const { accountAddress } = useContext(WalletContext);
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = useCallback(async () => {
    // Mark RFQ as closed
    // Indicate it in the chatroom

    const base = data.isBuy ? data.base.symbol : data.quote.symbol;
    const baseAmount = data.isBuy ? data.price : data.amount;
    const quote = !data.isBuy ? data.base.symbol : data.quote.symbol;
    const quoteAmount = !data.isBuy ? data.price : data.amount;

    const q = query(
      collection(db, 'orders'),
      where('dealer', '==', data.dealer)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.docs.map((item) => {
      if (
        baseAmount === data.amount &&
        quoteAmount === data.price &&
        quote === data.quote &&
        item.data().dealerAddress === accountAddress &&
        base === data.base &&
        data.isBuy === item.data().isBuy
      )
        console.log('Fire');
    });
  }, [data, accountAddress]);

  // useEffect(() => {
  //   setDisabled(accountAddress !== data.dealerAddress);
  // }, [accountAddress, data.dealerAddress, open]);

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Box className="space-y-4 flex flex-col">
        <Typography variant="h5">Close RFQ</Typography>
        <Box className="flex flex-col bg-umbra p-3 rounded-xl border space-y-2 border-mineshaft">
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Order Type
            </Typography>
            <Typography variant="h6">{data.isBuy ? 'Buy' : 'Sell'}</Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Status
            </Typography>
            <Typography variant="h6">
              {data.isFulfilled ? 'Closed' : 'Pending'}
            </Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Quote
            </Typography>
            <Typography variant="h6">{data.quote}</Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Price
            </Typography>
            <Typography variant="h6">
              {data.price} {data.quote}
            </Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Base
            </Typography>
            <Typography variant="h6">{data.base}</Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Amount
            </Typography>
            <Typography variant="h6">{data.amount}</Typography>
          </Box>
        </Box>
        <CustomButton
          color="primary rounded-xl"
          size="medium"
          onClick={handleSubmit}
          disabled={disabled}
        >
          Close
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default CloseRfqDialog;
