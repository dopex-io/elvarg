import { Box, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useBoundStore } from 'store';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

import {
  DISCLAIMER_MESSAGE,
  OFAC_COMPLIANCE_LOCAL_STORAGE_KEY,
} from 'constants/index';

import Dialog from 'components/UI/Dialog';
import CustomButton from 'components/UI/Button';

const DisclaimerDialog = (props: any) => {
  const { open, handleClose } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const {
    signer,
    accountAddress,
    setOpenComplianceDialog,
    userCompliant,
    setUserCompliant,
  } = useBoundStore();

  const handleSign = useCallback(async () => {
    if (!signer || !accountAddress || userCompliant) {
      return;
    }
    setLoading(true);
    const signature = await signer.signMessage(DISCLAIMER_MESSAGE['english']);

    let toStore: { [key: string]: any } = {};
    toStore[OFAC_COMPLIANCE_LOCAL_STORAGE_KEY] = signature;

    try {
      await axios
        .get(
          `https://soa242vijmzlx3iaazdzwd5wxi0mdlif.lambda-url.us-east-1.on.aws/?address=${accountAddress}&signature=${signature}`
        )
        .then(() =>
          localStorage.setItem(accountAddress, JSON.stringify(toStore))
        )
        .then(() => setOpenComplianceDialog(false))
        .then(() => setLoading(false));
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }, [
    signer,
    accountAddress,
    setOpenComplianceDialog,
    userCompliant,
    setUserCompliant,
  ]);

  return (
    <Dialog
      className="w-full"
      open={open}
      handleClose={() => handleClose(false)}
      showCloseIcon
    >
      <Box>
        <Box className="p-3">
          <Typography variant="body1" className="text-white font-semibold pb-2">
            US/OFAC compliance agreement
          </Typography>
          <Typography className="text-stieglitz" variant="body2">
            By using the Dopex DApp, I agree to the following terms and
            conditions:
          </Typography>
        </Box>
        <Box className="p-3 bg-umbra rounded-lg">
          {DISCLAIMER_MESSAGE['english'].split('\n').map((message, index) => (
            <Typography
              className="py-2 px-1 text-white"
              key={index}
              variant="body2"
            >
              &#x2022; {message}
            </Typography>
          ))}
          <Box className="pt-4 pb-1 w-full flex items-center justify-center">
            <CustomButton onClick={handleSign} className="w-full px-5">
              {loading ? (
                <CircularProgress className="text-white p-1" size={25} />
              ) : (
                'Sign and proceed'
              )}
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default DisclaimerDialog;
