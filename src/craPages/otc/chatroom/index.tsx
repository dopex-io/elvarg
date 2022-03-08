import { useState, useContext, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  addDoc,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useFormik } from 'formik';
import * as yup from 'yup';
import noop from 'lodash/noop';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import format from 'date-fns/format';
import Tooltip from '@mui/material/Tooltip';

import AppBar from 'components/AppBar';
import Typography from 'components/UI/Typography';
import Input from 'components/UI/Input';

import { OtcContext } from 'contexts/Otc';
import { WalletContext } from 'contexts/Wallet';

import { db } from 'utils/firebase/initialize';
import CustomButton from 'components/UI/CustomButton';

const Chatroom = () => {
  const chat = useParams();
  const navigate = useNavigate();

  const { validateUser, user } = useContext(OtcContext);
  const { accountAddress } = useContext(WalletContext);

  const validationSchema = yup.object({
    msg: yup.string().required('Cannot send empty message'),
  });
  const formik = useFormik({
    initialValues: {
      msg: '',
      timestamp: 0,
    },
    validationSchema: validationSchema,
    onSubmit: noop,
  });

  const q = query(
    collection(db, `chatrooms/${chat.id}/messages`),
    orderBy('timestamp')
  );

  const [msgs] = useCollectionData(q, { idField: 'id' });

  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fulfilled, setFulfilled] = useState(false);

  const handleChange = useCallback(
    (e) => {
      formik.setFieldValue('msg', e.target.value);
    },
    [formik]
  );

  const handleDelete = useCallback(async () => {
    await updateDoc(doc(db, 'chatrooms', chat.id), {
      isFulfilled: true,
    });

    const querySnapshot = (
      await getDocs(collection(db, 'orders'))
    ).docs.flatMap((doc) => doc);

    const chatroomData = (await getDoc(doc(db, 'chatrooms', chat.id))).data();

    const result = querySnapshot.find(
      (doc) => doc.data().timestamp.seconds === chatroomData.timestamp.seconds
    );

    if (result) await deleteDoc(doc(db, 'orders', result.id));
    else console.log('Something went wrong.');

    setFulfilled(true);
  }, [chat]);

  const handleSubmit = useCallback(async () => {
    await addDoc(collection(db, `chatrooms/${chat.id}/${'messages'}`), {
      msg: formik.values.msg,
      timestamp: new Date(),
      username: user.username,
    });
    formik.setFieldValue('msg', '');
  }, [formik, chat, user]);

  useEffect(() => {
    (async () => {
      const querySnapshot = await getDocs(collection(db, 'chatrooms'));
      let chatrooms = [];
      querySnapshot.forEach((doc) => {
        chatrooms.push({ id: doc.id, data: doc.data() });
      });

      const chatroomData = chatrooms
        .filter((document) => document.id === chat.id)
        .pop();

      setFulfilled(chatroomData.data.isFulfilled);

      setLoading(!msgs);
    })();
  }, [msgs, validateUser, formik, chat.id]);

  useEffect(() => {
    (async () => {
      const docRef = (await getDocs(collection(db, 'chatrooms'))).docs.flatMap(
        (doc) => doc
      );
      const result = docRef.find((doc) => doc.id === chat.id);

      setAdmin(result.data().dealerAddress === accountAddress);
    })();
  }, [user, accountAddress, chat.id]);

  return (
    <Box className="bg-black min-h-screen">
      <AppBar active="OTC" />
      <Box className="container pt-48 mx-auto h-screen px-4 lg:px-0">
        <Box className="flex flex-col justify-between w-1/3 h-5/6 mx-auto bg-cod-gray rounded-xl">
          <Box className="bg-umbra rounded-t-xl">
            <Box className="flex justify-between">
              <Box className="flex space-x-4">
                <IconButton onClick={() => navigate('/otc')} disableRipple>
                  <ArrowBackIcon className="fill-current text-stieglitz" />
                </IconButton>
                <Typography variant="h6" className="my-auto">
                  Chat Session
                </Typography>
                <Typography variant="h6" className="text-stieglitz my-auto">
                  {chat.id}
                </Typography>
              </Box>
              {admin && (
                <Box className="my-auto pr-3">
                  <Tooltip
                    className="text-stieglitz"
                    title={fulfilled ? 'Close this RFQ and chatroom' : ''}
                    arrow={true}
                  >
                    <Box className="rounded-md hover:bg-down-bad hover:bg-opacity-0 bg-opacity-0">
                      <CustomButton
                        size="small"
                        color="down-bad"
                        onClick={handleDelete}
                        disabled={fulfilled || loading}
                      >
                        Close RFQ
                      </CustomButton>
                    </Box>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Box>
          <Box className="h-full overflow-y-scroll flex flex-col-reverse p-0">
            {loading ? (
              <Box className="flex h-full justify-center">
                <CircularProgress className="self-center" />
              </Box>
            ) : msgs.length === 0 ? (
              <Box className="flex justify-center pt-4">
                <Typography
                  variant="h5"
                  className="text-stieglitz self-center pb-4"
                >
                  Be the first to message here
                </Typography>
              </Box>
            ) : (
              msgs
                .slice()
                .reverse()
                .map((msg: any, index) => {
                  return (
                    <Box
                      className={`flex my-2 space-x-2 ${
                        user?.username === msg.username
                          ? 'flex-end flex-row-reverse'
                          : null
                      }`}
                      key={index}
                    >
                      <Box className="flex mx-4 flex-col space-y-2">
                        <Typography
                          variant="h6"
                          className={`flex text-stieglitz text-xs ${
                            user?.username === msg.username ? 'self-end' : null
                          }`}
                        >
                          {msg.username}
                        </Typography>
                        <Box
                          className={`flex ${
                            user?.username === msg.username
                              ? 'flex-row-reverse'
                              : ''
                          }`}
                        >
                          <Box
                            className={`flex py-1 px-2 rounded-3xl ${
                              user?.username === msg.username
                                ? 'bg-primary'
                                : 'bg-mineshaft'
                            }`}
                          >
                            <Typography variant="h5" className="my-auto">
                              {msg.msg}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography
                          variant="h6"
                          className={`my-auto text-xs text-stieglitz ${
                            user?.username === msg.username
                              ? 'self-end'
                              : 'self-start'
                          }`}
                        >
                          {format(
                            msg.timestamp.seconds * 1000,
                            'hh:mm:aaa EEE d LLL'
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })
            )}
          </Box>
          {fulfilled ? (
            <>
              <Box className="px-4 my-2 space-y-2">
                <hr className="border-mineshaft" />
                <Typography variant="h6" className="text-center text-stieglitz">
                  {'Chatroom is closed'}
                </Typography>
              </Box>
            </>
          ) : null}
          <Box className="flex rounded-b-xl bg-umbra">
            <Input
              type="text"
              leftElement={
                <IconButton onClick={handleSubmit} disabled={fulfilled}>
                  <SendIcon className="fill-current text-blue-400 mx-auto" />
                </IconButton>
              }
              className="mx-auto w-full"
              value={formik.values.msg}
              onChange={handleChange}
              onSubmit={handleSubmit}
              disabled={fulfilled}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Chatroom;
