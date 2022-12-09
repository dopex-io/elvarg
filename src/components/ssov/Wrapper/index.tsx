import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextField from '@mui/material/TextField';
import { ethers } from 'ethers';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
export interface Props {
  open: boolean;
  handleClose: any;
}

const Wrapper = ({ open, handleClose }: Props) => {
  const { signer } = useBoundStore();

  const sendTx = useSendTx();

  const [value, setValue] = useState(0);

  const wrap = useCallback(async () => {
    const weth = new ethers.Contract(
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      ['function deposit() payable external'],
      signer
    );

    await sendTx(weth, 'deposit', [], getContractReadableAmount(value, 18));
  }, [signer, sendTx, value]);

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      classes={{ paper: 'rounded-2xl m-0' }}
    >
      <Box className="flex flex-col">
        <Box className="flex flex-row items-center mb-4">
          <IconButton
            className="p-0 mr-3 my-auto"
            onClick={handleClose}
            size="large"
          >
            <ArrowBackIcon
              className="text-stieglitz items-center"
              fontSize="large"
            />
          </IconButton>
          <Typography variant="h3">Wrap ETH</Typography>
        </Box>
        <TextField
          onChange={(e) => setValue(Number(e.target.value))}
          type="number"
          classes={{ root: 'mb-5' }}
          inputProps={{
            className: 'text-white',
          }}
          value={value}
        />
        <CustomButton size="medium" onClick={wrap}>
          Wrap
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default Wrapper;
