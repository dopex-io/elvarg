import { useState, useEffect, useContext, useCallback } from 'react';
import Box from '@material-ui/core/Box';
import Slide from '@material-ui/core/Slide';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useFormik } from 'formik';
import * as yup from 'yup';
import noop from 'lodash/noop';
import { doc, setDoc, addDoc, collection } from '@firebase/firestore';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import Switch from 'components/UI/Switch';
import Input from 'components/UI/Input';
import ErrorBox from 'components/ErrorBox';

import { WalletContext } from 'contexts/Wallet';
import { OtcContext } from 'contexts/Otc';

import { db } from 'utils/firebase/initialize';

interface RegisterProps {
  open: boolean;
  handleClose: () => void;
}

const Register = ({ open, handleClose }: RegisterProps) => {
  const { accountAddress } = useContext(WalletContext);
  const { user, users, validateUser } = useContext(OtcContext);

  const [loading, setLoading] = useState(false);

  console.log(users);

  const validationSchema = yup.object({
    username: yup
      .string()
      .matches(
        /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
        `Invalid username format. Must contain the following:
        8-20 characters, no _ or . at the beginning,  no __ or _. or ._ or .. inside, no _ or . at the end
        `
      )
      .required('Username is required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      accountAddress: accountAddress,
    },
    validationSchema: validationSchema,
    onSubmit: noop,
  });
  const handleChange = useCallback(
    (e) => {
      formik.setFieldValue('username', e.target.value);
    },
    [formik]
  );

  const handleSubmit = useCallback(async () => {
    console.log('called');
    await setDoc(doc(db, 'users', accountAddress), {
      username: formik.values.username,
    }).then(() => {
      handleClose();
    });
  }, [accountAddress, formik, handleClose]);

  useEffect(() => {
    setLoading(true);
    (async () => {
      validateUser()
        .then((result) => {
          setLoading(false);
          handleClose();
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    })();
  }, [validateUser, handleClose]);

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Box className="flex flex-col space-y-4">
        <Typography variant="h5" className="text-stieglitz">
          Register
        </Typography>
        {loading ? (
          <CircularProgress size={32} className="mx-auto" />
        ) : (
          <Box className="space-y-4">
            <Box className="flex flex-col">
              <Input
                onChange={handleChange}
                leftElement={null}
                type="text"
                placeholder="Enter username"
              />
            </Box>
            <Box>
              <ErrorBox error={formik.errors.username} />
            </Box>
            <CustomButton
              size="large"
              className="flex w-full rounded-xl"
              disabled={Boolean(formik.errors.username)}
              onClick={handleSubmit}
            >
              Register
            </CustomButton>
          </Box>
        )}

        {/* <Switch size="small" onClick={() => setChecked(!checked)} />
        {!checked ? (
          <Slide direction="left" in={checked} mountOnEnter unmountOnExit>
            <Box>
              <Typography variant="h6">Hi</Typography>
            </Box>
          </Slide>
        ) : (
          <Slide direction="left" in={checked} mountOnEnter unmountOnExit>
            <Box>
              <Typography variant="h6">
                Before you can use the OTC, you must first register your address
                to a username. Create and link your username here
              </Typography>
            </Box>
          </Slide>
        )} */}
      </Box>
    </Dialog>
  );
};

export default Register;
