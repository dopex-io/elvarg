import { useState, useEffect, useMemo, useContext, useCallback } from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useFormik } from 'formik';
import * as yup from 'yup';
import noop from 'lodash/noop';
import { doc, setDoc } from '@firebase/firestore';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import Input from 'components/UI/Input';
import ErrorBox from 'components/ErrorBox';
import InfoPopover from 'components/UI/InfoPopover';

import { WalletContext } from 'contexts/Wallet';
import { OtcContext } from 'contexts/Otc';

import { db } from 'utils/firebase/initialize';
import { delay } from 'lodash';

interface RegisterProps {
  open: boolean;
  handleClose: () => void;
}

const Register = ({ open, handleClose }: RegisterProps) => {
  const { accountAddress } = useContext(WalletContext);
  const { user, users, validateUser } = useContext(OtcContext);

  const [loading, setLoading] = useState(true);
  const [validated, setValidated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
      username: undefined,
      accountAddress: accountAddress,
    },
    validationSchema: validationSchema,
    onSubmit: noop,
  });

  const usernameExists = useMemo(() => {
    return users.find((user) => user.username === formik.values.username);
  }, [users, formik.values.username]);

  const handleChange = useCallback(
    (e) => {
      formik.setFieldValue('username', e.target.value);
    },
    [formik]
  );

  const handleSubmit = useCallback(async () => {
    try {
      await setDoc(
        doc(db, 'users', accountAddress),
        {
          username: formik.values.username,
          createdAt: new Date(),
        },
        {
          merge: false,
        }
      );
      handleClose();
    } catch (e) {
      setErrorMsg(e);
    }
  }, [accountAddress, formik, handleClose]);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const validatedUser = await validateUser();
      if (validatedUser) {
        setValidated(true);
        setLoading(false);
        delay(handleClose, 1000);
      }
      delay(setLoading, 2000, false);
    })();
  }, [handleClose]);

  useEffect(() => {
    setErrorMsg(usernameExists ? 'Username already exists' : null);
  }, [usernameExists]);

  return (
    <Dialog open={open} handleClose={handleClose}>
      <Box className="flex flex-col space-y-4">
        {loading ? (
          <Box className="my-16 self-center">
            <CircularProgress size={32} className="mx-auto" />
          </Box>
        ) : (
          <Box className="space-y-4">
            {validated ? (
              <Box className="space-y-4 flex justify-center my-16">
                <Box className="self-center text-center animate-pulse">
                  <Typography variant="h3">Welcome</Typography>
                  <Typography variant="h3" className="text-stieglitz">
                    {user?.username}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <>
                <Box className="flex flex-col space-y-4">
                  <Typography variant="h5" className="text-stieglitz">
                    Register
                  </Typography>
                  <Box className="flex justify-between">
                    <Box className="flex space-x-2 my-auto">
                      <Typography variant="h6" className="text-stieglitz">
                        Username
                      </Typography>
                      <InfoPopover
                        id="username"
                        className="text-stieglitz"
                        infoText="Create an alias/username to link to your wallet address"
                      />
                    </Box>
                    <Input
                      onChange={handleChange}
                      leftElement={null}
                      type="text"
                      className="my-0 py-0 w-1/2"
                    />
                  </Box>
                </Box>
                <Box>
                  <ErrorBox error={formik.errors.username || errorMsg} />
                </Box>
                <CustomButton
                  size="large"
                  className="flex w-full rounded-xl"
                  disabled={
                    Boolean(formik.errors.username) || Boolean(usernameExists)
                  }
                  onClick={handleSubmit}
                >
                  Register
                </CustomButton>
              </>
            )}
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default Register;
