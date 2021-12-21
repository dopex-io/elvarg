import { useState, useContext, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, addDoc, orderBy } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useFormik } from 'formik';
import * as yup from 'yup';
import noop from 'lodash/noop';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CircularProgress from '@material-ui/core/CircularProgress';

import AppBar from 'components/AppBar';
import Typography from 'components/UI/Typography';
import Input from 'components/UI/Input';

import { OtcContext } from 'contexts/Otc';

import { db } from 'utils/firebase/initialize';

interface MessageType {
  msg: string;
  timestamp: any;
  uid: string;
}

const Chatroom = () => {
  const chat = useParams();
  const navigate = useNavigate();

  const { auth } = useContext(OtcContext);

  const validationSchema = yup.object({
    msg: yup.string().required('Cannot send empty message'),
  });
  const formik = useFormik({
    initialValues: {
      msg: '',
      timestamp: 0,
      uid: '',
    },
    validationSchema: validationSchema,
    onSubmit: noop,
  });

  const q = query(
    collection(db, `chatrooms/${chat.uid}/messages`),
    orderBy('timestamp')
  );

  const [msgs] = useCollectionData(q, { idField: 'id' });

  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState({});

  const handleChange = useCallback(
    (e) => {
      formik.setFieldValue('msg', e.target.value);
    },
    [formik]
  );

  const handleSubmit = useCallback(async () => {
    await addDoc(collection(db, `chatrooms/${chat.uid}/messages`), {
      msg: formik.values.msg,
      timestamp: new Date(),
      uid: formik.values.uid,
    });
    formik.setFieldValue('msg', '');
  }, [formik, chat.uid]);

  useEffect(() => {
    if (!msgs) setLoading(true);
    else setLoading(false);
    setCurrentUser(auth.currentUser);
  }, [msgs, auth.currentUser]);

  return (
    <Box className="bg-black min-h-screen">
      <AppBar active="OTC" />
      <Box className="container pt-24 mx-auto h-screen px-4 lg:px-0">
        <Typography variant="h3" className="flex justify-center my-6">
          Chatroom Placeholder
        </Typography>
        <Typography
          variant="h5"
          className="flex justify-center my-3 text-stieglitz"
        >
          Welcome to Chatroom {chat.uid}. You may place your bids/asks for the
          given RFQ here and come to a settlement with this dealer.
        </Typography>
        <Box className="flex flex-col justify-between w-1/3 h-5/6 mx-auto bg-cod-gray rounded-xl">
          <Box className="bg-umbra rounded-t-xl">
            <Box className="flex justify-between">
              <IconButton onClick={() => navigate('/otc')}>
                <ArrowBackIcon className="fill-current text-stieglitz" />
              </IconButton>
              <Typography variant="h4" className="p-4 my-auto">
                Chat Session
              </Typography>
              <Typography variant="h6" className="text-stieglitz p-4 my-auto">
                ID: {chat.uid}
              </Typography>
            </Box>
          </Box>
          <Box className="h-full overflow-y-scroll">
            {loading ? (
              <Box className="flex h-full justify-center">
                <CircularProgress className="self-center" />
              </Box>
            ) : (
              msgs.map((msg: any, index) => {
                return (
                  <Box
                    className={`flex my-2 mx-2 space-x-2 ${
                      auth.currentUser.uid === chat.uid
                        ? 'flex-end flex-row-reverse'
                        : null
                    }`}
                    key={index}
                  >
                    <Box
                      className={`flex p-4 mx-2 rounded-3xl ${
                        auth.currentUser.uid === chat.uid
                          ? 'bg-primary'
                          : 'bg-umbra'
                      }`}
                    >
                      <Typography variant="h5" className="my-auto">
                        {msg.msg}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      className="my-auto text-xs text-stieglitz"
                    >
                      {new Date(msg.timestamp.seconds * 1000).toDateString()}
                    </Typography>
                  </Box>
                );
              })
            )}
          </Box>
          <Box className="flex w-full rounded-b-xl bg-umbra">
            <Input
              type="text"
              leftElement={
                <IconButton onClick={handleSubmit}>
                  <SendIcon className="fill-current text-blue-400 mx-auto" />
                </IconButton>
              }
              className="mx-auto w-full"
              value={formik.values.msg}
              onChange={handleChange}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Chatroom;
