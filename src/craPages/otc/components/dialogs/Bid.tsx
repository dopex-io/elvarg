import { useCallback, useContext, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useFormik } from 'formik';
import noop from 'lodash/noop';
import * as yup from 'yup';
import Input from '@material-ui/core/Input';
import {
  collection,
  doc,
  setDoc,
  DocumentData,
  query,
  orderBy,
  getDoc,
} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { format } from 'date-fns';

import { OtcContext } from 'contexts/Otc';
import { WalletContext } from 'contexts/Wallet';

import Typography from 'components/UI/Typography';
import Dialog from 'components/UI/Dialog';
import CustomButton from 'components/UI/CustomButton';

import { db } from 'utils/firebase/initialize';
import smartTrim from 'utils/general/smartTrim';

interface BidDialogProps {
  open: boolean;
  handleClose: () => void;
  data: DocumentData;
}

const Bid = ({ open, handleClose, data }: BidDialogProps) => {
  const { user } = useContext(OtcContext);
  const { accountAddress } = useContext(WalletContext);

  const [ongoingBids, setOngoingBids] = useState<any[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);

  const validationSchema = yup.object({
    bid: yup.number().min(0, 'Amount must be greater than 0.'),
  });

  const formik = useFormik({
    initialValues: {
      bid: '',
    },
    onSubmit: noop,
    validationSchema: validationSchema,
  });

  const q = query(
    collection(db, `orders/${data.id}/bids`),
    orderBy('timestamp')
  );

  const [bids] = useCollectionData(q, { idField: 'id' });

  const handleSubmit = useCallback(async () => {
    if (!user) return;
    const params = {
      counterParty: user?.username,
      counterPartyAddress: user?.accountAddress,
      bidPrice: formik.values.bid,
      timestamp: new Date(),
    };

    await setDoc(
      doc(db, `orders/${data.id}/bids`, user?.accountAddress),
      params,
      {
        merge: false,
      }
    ).catch((e) => {
      console.log('Already created bid... reverted with error: ', e);
    });
  }, [user, formik, data]);

  useEffect(() => {
    (async () => {
      setOngoingBids(bids);
    })();
  }, [bids]);

  useEffect(() => {
    (async () => {
      if (!user || !data) return;

      const ref = await getDoc(
        doc(db, `orders/${data.id}/bids`, user?.accountAddress)
      );

      setDisabled(
        // !!ref.data() ||
        user?.accountAddress === data.data.dealerAddress || !user
      );
    })();
  }, [data, user]);

  useEffect(() => {
    (async () => {
      setDisabled(!user);
    })();
  });

  const handleChange = useCallback(
    (e) => {
      formik.setFieldValue('bid', e.target.value);
    },
    [formik]
  );
  return (
    accountAddress && (
      <Dialog open={open} handleClose={handleClose} showCloseIcon>
        <Box className="space-y-2 flex flex-col">
          <Typography variant="h4">Bid</Typography>
          <Box className="flex justify-between mx-2">
            <Typography variant="h6" className="text-stieglitz">
              Date
            </Typography>
            <Typography variant="h6" className="text-stieglitz">
              Bid
            </Typography>
            {data.data.dealerAddress === user?.accountAddress ? (
              <Typography variant="h6" className="text-stieglitz">
                Address
              </Typography>
            ) : null}
          </Box>
          {ongoingBids?.length > 0 ? (
            <Box className="flex flex-col bg-umbra p-3 rounded-xl border space-y-2 border-mineshaft max-h-48 overflow-auto">
              {ongoingBids?.map((bid, index) => {
                const currentUser =
                  bid.counterPartyAddress === user?.accountAddress;

                return (
                  <Box className="flex justify-between" key={index}>
                    <Typography
                      variant="h6"
                      className={`${
                        currentUser ? 'text-emerald-500' : 'text-stieglitz'
                      } my-auto`}
                    >
                      {format(bid.timestamp.seconds * 1000, 'H:mm d LLL')}
                    </Typography>
                    <Typography
                      variant="h6"
                      className={`${
                        currentUser ? 'text-emerald-500' : 'text-stieglitz'
                      } my-auto`}
                    >
                      {bid.bidPrice} {data.data.quote}
                    </Typography>
                    {user?.accountAddress === data.data.dealerAddress ? (
                      <Box className="flex flex-col text-center">
                        <Typography
                          variant="h6"
                          className={`${
                            currentUser ? 'text-emerald-500' : 'text-white'
                          }`}
                        >
                          {smartTrim(bid.counterPartyAddress, 8)}
                        </Typography>
                        <Typography
                          variant="h6"
                          className={`${
                            currentUser ? 'text-emerald-500' : 'text-stieglitz'
                          }`}
                        >
                          {bid.counterParty}
                        </Typography>
                      </Box>
                    ) : null}
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box className="bg-umbra p-3 rounded-xl border space-y-2 border-mineshaft text-center py-8">
              <Typography variant="h6" className="text-white">
                No ongoing bids
              </Typography>
            </Box>
          )}
          <Typography variant="h5">RFQ Details</Typography>
          <Box className="flex flex-col bg-umbra p-3 rounded-xl border space-y-2 border-mineshaft overflow-auto">
            <Box className="flex justify-between">
              <Typography variant="h6" className="text-stieglitz">
                Dealer
              </Typography>
              <Typography variant="h6" className="text-stieglitz">
                {data.data.dealer}
              </Typography>
            </Box>
            <Box className="flex justify-between">
              <Typography variant="h6" className="text-stieglitz">
                Expiration
              </Typography>
              <Typography variant="h6" className="text-stieglitz">
                {format(data.data.timestamp.seconds * 1000, 'H:mm, d LLL YYY')}
              </Typography>
            </Box>
            <Box className="flex justify-between">
              <Typography variant="h6" className="text-stieglitz">
                Status
              </Typography>
              <Typography variant="h6" className="text-stieglitz">
                {data.data.isFulfilled ? 'Closed' : 'Open'}
              </Typography>
            </Box>
            <Box className="flex justify-between">
              <Typography variant="h6" className="text-stieglitz">
                Quote
              </Typography>
              <Typography variant="h6" className="text-stieglitz">
                {data.data.quote}
              </Typography>
            </Box>
            <Box className="flex justify-between">
              <Typography variant="h6" className="text-stieglitz">
                Base
              </Typography>
              <Typography variant="h6" className="text-stieglitz">
                {data.data.base}
              </Typography>
            </Box>
            <Box className="flex justify-between">
              <Typography variant="h6" className="text-stieglitz">
                Price
              </Typography>
              <Typography variant="h6" className="text-stieglitz">
                {data.data.price} {data.data.quote}
              </Typography>
            </Box>
            <Box className="flex justify-between">
              <Typography variant="h6" className="text-stieglitz">
                Amount
              </Typography>
              <Typography variant="h6" className="text-stieglitz">
                {data.data.amount} tokens
              </Typography>
            </Box>
          </Box>

          <Box className="flex justify-between px-2">
            <Typography variant="h5" className="text-stieglitz my-auto">
              Place/Update Bid
            </Typography>
            <Box className="flex self-end">
              <Input
                disableUnderline={true}
                id="bid"
                name="bid"
                value={formik.values.bid || 0}
                onChange={handleChange}
                type="number"
                className="h-8 text-sm text-white bg-umbra rounded-lg p-2"
                classes={{ input: 'text-white text-right' }}
                placeholder="Place Bid"
              />
            </Box>
          </Box>
          <CustomButton
            color="primary"
            size="medium"
            onClick={handleSubmit}
            disabled={disabled}
          >
            Place Bid
          </CustomButton>
        </Box>
      </Dialog>
    )
  );
};

export default Bid;
