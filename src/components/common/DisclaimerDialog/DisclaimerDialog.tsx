import { Box, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useBoundStore } from 'store';
import axios from 'axios';

import {
  DISCLAIMER_MESSAGE,
  OFAC_COMPLIANCE_LOCAL_STORAGE_KEY,
} from 'constants/index';

import Dialog from 'components/UI/Dialog';
import CustomButton from 'components/UI/Button';

const DisclaimerDialog = (props: any) => {
  const { open, handleClose } = props;
  const { signer, accountAddress, setOpenComplianceDialog, userCompliant } =
    useBoundStore();

  const handleSign = useCallback(async () => {
    if (!signer || !accountAddress || userCompliant) {
      return;
    }
    const signature = await signer.signMessage(DISCLAIMER_MESSAGE['english']);
    setOpenComplianceDialog(false);

    try {
      await axios.get(
        `https://soa242vijmzlx3iaazdzwd5wxi0mdlif.lambda-url.us-east-1.on.aws/?address=${accountAddress}&signature=${signature}`
      );
    } catch (err) {
      console.log(err);
    }

    let toStore: { [key: string]: any } = {};
    toStore[OFAC_COMPLIANCE_LOCAL_STORAGE_KEY] = signature;

    localStorage.setItem(accountAddress, JSON.stringify(toStore));
  }, [signer, accountAddress, setOpenComplianceDialog, userCompliant]);

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
            US/OFAC Complaince agreement
          </Typography>
          <Typography className="text-stieglitz" variant="body2">
            By using Dopex dApp, I agree to the following terms and conditions:
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
          <Box className="pt-4 pb-1 flex items-center justify-center">
            <CustomButton onClick={handleSign} className="px-5">
              Sign and proceed
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default DisclaimerDialog;
