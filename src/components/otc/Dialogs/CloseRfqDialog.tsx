// @ts-nocheck
import { useCallback, useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import {
  doc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  onSnapshot,
  DocumentData,
} from 'firebase/firestore';

import Typography from 'components/UI/Typography';
import Dialog from 'components/UI/Dialog';
import CustomButton from 'components/UI/CustomButton';
import DialogDataRow from 'components/otc/DialogDataRow';

import { WalletContext } from 'contexts/Wallet';

import { db } from 'utils/firebase/initialize';

interface CloseRfqDialogProps {
  open: boolean;
  handleClose: () => {};
  id: string;
  data: DocumentData;
}

const CloseRfqDialog = (props: CloseRfqDialogProps) => {
  const { open, id, data, handleClose } = props;

  const { accountAddress } = useContext(WalletContext);
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = useCallback(async () => {
    const q = query(
      collection(db, 'orders'),
      where('dealerAddress', '==', accountAddress)
    );

    const querySnapshot = await getDocs(q);

    const temp = querySnapshot.docs.find((item) => item.id === id);

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
              document.data.timestamp.seconds === data.timestamp.seconds
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
  }, [accountAddress, data, id]);

  useEffect(() => {
    (async () => {
      const q = query(collection(db, 'orders'));

      onSnapshot(q, (querySnapshot) => {
        const temp = querySnapshot.docs.find((item) => item.id === id);

        setDisabled(
          accountAddress === data.dealerAddress || temp.data().isFulfilled
        );
      });
    })();
  }, [accountAddress, data, id]);

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Box className="space-y-4 flex flex-col">
        <Typography variant="h5">Close RFQ</Typography>
        <Box className="flex flex-col bg-umbra p-3 rounded-xl border space-y-2 border-mineshaft">
          <DialogDataRow
            info="Order Type"
            value={data.isBuy ? 'Buy' : 'Sell'}
          />
          <DialogDataRow
            info="Status"
            value={data.isFulfilled ? 'Closed' : 'Pending'}
          />
          <DialogDataRow info="Quote" value={data.quote} />
          <DialogDataRow info="Price" value={`${data.price} ${data.quote}`} />
          <DialogDataRow info="Base" value={data.base} />
          <DialogDataRow info="Amount" value={data.amount} />
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
