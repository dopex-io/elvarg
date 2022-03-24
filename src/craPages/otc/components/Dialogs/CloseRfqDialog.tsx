import { useCallback, useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import {
  doc,
  collection,
  // deleteDoc,
  getDocs,
  query,
  // getDoc,
  where,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';

import Typography from 'components/UI/Typography';
import Dialog from 'components/UI/Dialog';
import CustomButton from 'components/UI/CustomButton';

import { WalletContext } from 'contexts/Wallet';

import { db } from 'utils/firebase/initialize';

const CloseRfqDialog = ({ open, handleClose, data }) => {
  const { accountAddress } = useContext(WalletContext);
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = useCallback(async () => {
    const q = query(
      collection(db, 'orders'),
      where('dealerAddress', '==', accountAddress)
    );

    const querySnapshot = await getDocs(q);

    const temp = querySnapshot.docs.find((item) => item.id === data.id);

    await updateDoc(doc(db, 'orders', temp.id), {
      isFulfilled: true,
    })
      .then(async () => {
        const querySnapshot = await getDocs(collection(db, 'chatrooms'));
        let chatrooms = [];
        querySnapshot.forEach((doc) => {
          chatrooms.push({ id: doc.id, data: doc.data() });
        });

        const chatroomData = chatrooms
          .filter(
            (document) =>
              document.data.timestamp.seconds === data.data.timestamp.seconds
          )
          .pop();

        await updateDoc(doc(db, 'chatrooms', chatroomData.id), {
          isFulfilled: true,
        }).catch((e) => {
          console.log('Failed to mark RFQ as complete. Error code ', e);
        });
      })
      .catch((e) => {
        console.log('Failed with error code ', e);
      });
  }, [accountAddress, data]);

  useEffect(() => {
    (async () => {
      const q = query(collection(db, 'orders'));

      onSnapshot(q, (querySnapshot) => {
        const temp = querySnapshot.docs.find((item) => item.id === data.id);

        setDisabled(
          accountAddress === data.dealerAddress || temp.data().isFulfilled
        );
      });
    })();
  }, [accountAddress, data]);

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
            <Typography variant="h6">{data.data.quote}</Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Price
            </Typography>
            <Typography variant="h6">
              {data.data.price} {data.data.quote}
            </Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Base
            </Typography>
            <Typography variant="h6">{data.data.base}</Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Amount
            </Typography>
            <Typography variant="h6">{data.data.amount}</Typography>
          </Box>
        </Box>
        <CustomButton
          color="primary rounded-xl"
          size="medium"
          onClick={handleSubmit}
          disabled={disabled || data.isFulfilled}
        >
          Close
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default CloseRfqDialog;
