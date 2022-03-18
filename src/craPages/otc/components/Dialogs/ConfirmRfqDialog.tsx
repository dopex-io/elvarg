import { useContext, useCallback, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { addDoc, collection, doc, getDocs, setDoc } from 'firebase/firestore';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import { OtcContext } from 'contexts/Otc';

import { db } from 'utils/firebase/initialize';
import smartTrim from 'utils/general/smartTrim';

interface ConfirmRfqDialogProps {
  open: boolean;
  handleClose: () => void;
  data: {
    isBuy: string;
    quote: {
      address: string;
      symbol: string;
    };
    price: string;
    base: {
      address: string;
      symbol: string;
    };
    amount: string;
    address: string;
    username: string;
  };
}

const ConfirmRfqDialog = ({
  open,
  handleClose,
  data,
}: ConfirmRfqDialogProps) => {
  const { user } = useContext(OtcContext);

  const [disabled, setDisabled] = useState(false);

  const handleSubmit = useCallback(async () => {
    const newDocRef = doc(collection(db, 'orders')); // generated document id

    const timestamp = new Date();

    const params = {
      isBuy: data.isBuy,
      isFulfilled: false,
      base: data.base.symbol,
      baseAddress: data.base.address,
      amount: data.amount,
      quote: data.quote.symbol,
      quoteAddress: data.quote.address,
      price: data.price,
      timestamp,
      dealer: user.username,
      dealerAddress: user.accountAddress,
    };

    await setDoc(doc(db, 'orders', newDocRef.id), params, { merge: true }).then(
      async () => {
        setDisabled(true);
        await addDoc(collection(db, 'chatrooms'), params).catch((e) => {
          console.log('Already created chatroom... reverted with error: ', e);
        });
      }
    );
  }, [data, user]);

  useEffect(() => {
    (async () => {
      let docId;
      const querySnapshot = await getDocs(collection(db, 'orders'));
      querySnapshot.forEach((doc) => {
        const base = data.isBuy ? data.base.symbol : data.quote.symbol;
        const baseAmount = data.isBuy ? data.price : data.amount;
        const quote = !data.isBuy ? data.base.symbol : data.quote.symbol;
        const quoteAmount = !data.isBuy ? data.price : data.amount;

        if (
          doc.data().base === base &&
          doc.data().quote === quote &&
          doc.data().dealer === user?.username &&
          doc.data().amount === baseAmount &&
          doc.data().price === quoteAmount &&
          doc.data().isBuy === data.isBuy
        )
          docId = doc.id;
      });

      if (docId) setDisabled(true || !user);
      else setDisabled(false || !user);
    })();
  }, [data, data.base.symbol, data.quote.symbol, user]);

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Box className="flex flex-col space-y-4">
        <Typography variant="h5">Create RFQ</Typography>
        <Box className="flex flex-col space-y-2 my-2 bg-umbra border border-mineshaft rounded-2xl p-3">
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Quote
            </Typography>
            <Typography variant="h6">
              {smartTrim(data.quote.symbol, 24)}
            </Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Base
            </Typography>
            <Typography variant="h6">
              {smartTrim(data.base.symbol, 24)}
            </Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Quantity
            </Typography>
            <Typography variant="h6">
              {Number(data.amount)} {'doTokens'}
            </Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Price
            </Typography>
            <Typography variant="h6">
              {Number(data.price)} {data.quote.symbol}
            </Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Order Type
            </Typography>
            <Typography variant="h6">{data.isBuy ? 'Buy' : 'Sell'}</Typography>
          </Box>
        </Box>
        <Box className="border border-umbra rounded-xl p-2">
          <Typography variant="h6" className="text-stieglitz text-center">
            By confirming, you are posting an indicative Request-for-Quote
            before making a live trade. Users can bid against your RFQ. You may
            choose the best offer before initiating a live trade.
          </Typography>
        </Box>
        <CustomButton
          size="medium"
          className="rounded-xl"
          onClick={handleSubmit}
          disabled={
            !data.base || !data.amount || !data.price || !data.quote || disabled
          }
        >
          {user ? (disabled ? 'Created' : 'Confirm') : 'Login'}
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default ConfirmRfqDialog;
