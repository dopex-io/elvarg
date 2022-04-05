import { useCallback, useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useFormik } from 'formik';
import noop from 'lodash/noop';
import * as yup from 'yup';
import Input from '@mui/material/Input';
import {
  collection,
  doc,
  setDoc,
  DocumentData,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { ERC20__factory, Escrow__factory } from '@dopex-io/sdk';
import { format } from 'date-fns';

import { OtcContext } from 'contexts/Otc';
import { WalletContext } from 'contexts/Wallet';

import Typography from 'components/UI/Typography';
import Dialog from 'components/UI/Dialog';
import CustomButton from 'components/UI/CustomButton';

import useSendTx from 'hooks/useSendTx';

import { db } from 'utils/firebase/initialize';
import smartTrim from 'utils/general/smartTrim';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

interface BidDialogProps {
  open: boolean;
  handleClose: () => void;
  data: DocumentData;
}

const Bid = ({ open, handleClose, data }: BidDialogProps) => {
  const sendTx = useSendTx();
  const { user, escrowData, loaded } = useContext(OtcContext);
  const { accountAddress, provider, signer } = useContext(WalletContext);

  const [ongoingBids, setOngoingBids] = useState<any[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [isDealer, setIsDealer] = useState<boolean>(false);

  const validationSchema = yup.object({
    bid: yup.number().min(0, 'Amount must be greater than 0.'),
  });

  const formik = useFormik({
    initialValues: {
      bid: 0,
    },
    onSubmit: noop,
    validationSchema: validationSchema,
  });

  const q = query(
    collection(db, `orders/${data.id}/bids`),
    orderBy('bidPrice', data.data.isBuy ? 'asc' : 'desc')
  );

  const [bids] = useCollectionData(q, { idField: 'id' });

  const handleSubmit = useCallback(async () => {
    if (!user) return;
    const params = {
      counterParty: user?.username,
      counterPartyAddress: user?.accountAddress,
      bidPrice: Number(formik.values.bid),
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

  const handleInitiateP2P = useCallback(
    async (index) => {
      if (!data || !ongoingBids) return;

      const escrow = Escrow__factory.connect(
        escrowData.escrowAddress,
        provider
      );

      const userQuoteAsset = ERC20__factory.connect(
        data.data.isBuy ? data.data.quoteAddress : data.data.baseAddress,
        provider
      );

      await userQuoteAsset
        .connect(signer)
        .approve(
          escrow.address,
          getContractReadableAmount(
            data?.data.isBuy ? ongoingBids[index].bidPrice : data.data.amount,
            18
          )
        );

      await sendTx(
        escrow
          .connect(signer)
          .open(
            data.data.isBuy ? data.data.quoteAddress : data.data.baseAddress,
            data.data.isBuy ? data.data.baseAddress : data.data.quoteAddress,
            ongoingBids[index].counterPartyAddress,
            getContractReadableAmount(
              data?.data.isBuy ? ongoingBids[index].bidPrice : data.data.amount,
              18
            ),
            getContractReadableAmount(
              data?.data.isBuy
                ? data?.data.amount
                : ongoingBids[index].bidPrice,
              18
            )
          )
      )
        .then(async () => {
          await setDoc(
            doc(db, `orders/${data.id}`),
            {
              isFulfilled: true,
            },
            {
              merge: true,
            }
          )
            .then(async () => {
              const querySnapshot = await getDocs(collection(db, 'chatrooms'));
              let chatrooms = [];
              querySnapshot.forEach((doc) => {
                chatrooms.push({ id: doc.id, data: doc.data() });
              });

              const chatroomData = chatrooms
                .filter(
                  (document) =>
                    document.data.timestamp.seconds ===
                    data.data.timestamp.seconds
                )
                .pop();

              if (chatroomData)
                await setDoc(
                  doc(db, `chatrooms/${chatroomData.id}`),
                  {
                    isFulfilled: true,
                  },
                  {
                    merge: true,
                  }
                ).catch((e) => {
                  console.log(
                    'Failed to update chatroom data. Reverted with error: ',
                    e
                  );
                });
            })
            .catch((e) => {
              console.log('Already created bid... reverted with error: ', e);
            });
        })
        .catch(() => {
          console.log('Transaction Failed');
        });
    },
    [data, escrowData, ongoingBids, provider, sendTx, signer]
  );

  useEffect(() => {
    (async () => {
      setOngoingBids(bids);
    })();
  }, [bids]);

  useEffect(() => {
    (async () => {
      if (!user || !data) return;

      // const ref = await getDoc(
      //   doc(db, `orders/${data.id}/bids`, user?.accountAddress)
      // );

      setDisabled(
        // !!ref.data() ||
        user?.accountAddress === data.data.dealerAddress
      );

      setIsDealer(user?.accountAddress === data.data.dealerAddress);
    })();
  }, [data, user]);

  const handleChange = useCallback(
    (e) => {
      formik.setFieldValue('bid', e.target.value);
    },
    [formik]
  );
  return (
    accountAddress && (
      <Dialog open={open} handleClose={handleClose} showCloseIcon width={500}>
        <Box className="space-y-2 flex flex-col">
          <Typography variant="h4">
            {data.data.isBuy ? 'Ask' : 'Bid'}
          </Typography>
          <Box
            className={`grid ${isDealer ? 'grid-cols-4' : 'grid-cols-2'} mx-2`}
          >
            <Typography variant="h6" className="text-stieglitz text-left">
              Date
            </Typography>
            <Typography
              variant="h6"
              className={`text-stieglitz ${
                isDealer ? 'text-center' : 'text-right'
              }`}
            >
              {data.data.isBuy ? 'Ask' : 'Bid'}
            </Typography>
            {isDealer ? (
              <>
                <Box>
                  <Typography
                    variant="h6"
                    className="text-stieglitz text-right"
                  >
                    Address
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="h6"
                    className="text-stieglitz text-right"
                  >
                    Action
                  </Typography>
                </Box>
              </>
            ) : null}
          </Box>
          {ongoingBids?.length > 0 ? (
            <Box className="bg-umbra p-3 rounded-xl border space-y-2 border-mineshaft max-h-48 overflow-auto">
              {ongoingBids?.map((bid, index) => {
                const currentUser =
                  bid.counterPartyAddress === user?.accountAddress;

                return (
                  <Box
                    className={`grid ${
                      isDealer ? 'grid-cols-4' : 'grid-cols-2'
                    }`}
                    key={index}
                  >
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
                      className={`${isDealer ? 'text-center' : 'text-right'} ${
                        currentUser ? 'text-emerald-500' : 'text-stieglitz'
                      } my-auto`}
                    >
                      {bid.bidPrice} {data.data.quote}
                    </Typography>
                    {user?.accountAddress === data.data.dealerAddress ? (
                      <Box className="flex justify-end">
                        <Box className="flex flex-col text-right justify-end">
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
                            className={`text-end ${
                              currentUser
                                ? 'text-emerald-500'
                                : 'text-stieglitz'
                            }`}
                          >
                            {smartTrim(bid.counterParty, 12)}
                          </Typography>
                        </Box>
                      </Box>
                    ) : null}
                    {accountAddress === data.data.dealerAddress && (
                      <Box className="flex justify-end">
                        <CustomButton
                          color="primary"
                          size="small"
                          onClick={() => handleInitiateP2P(index)}
                          className="my-auto"
                          disabled={!loaded}
                        >
                          {loaded ? 'Trade' : 'Loading...'}
                        </CustomButton>
                      </Box>
                    )}
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
                Order Type
              </Typography>
              <Typography variant="h6" className="text-stieglitz">
                {data.data.isBuy ? 'Buy' : 'Sell'}
              </Typography>
            </Box>
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
              Place Offer
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
                placeholder="Place Offer"
              />
            </Box>
          </Box>
          <CustomButton
            color="primary"
            size="medium"
            onClick={handleSubmit}
            disabled={disabled}
          >
            Place Offer
          </CustomButton>
        </Box>
      </Dialog>
    )
  );
};

export default Bid;
