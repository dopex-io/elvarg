import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import { ethers } from 'ethers';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import Input from 'components/UI/Input';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

export interface Props {
  open: boolean;
  handleClose: any;
}

const Wrapper = ({ open, handleClose }: Props) => {
  const { signer, userAssetBalances } = useBoundStore();

  const sendTx = useSendTx();

  const [value, setValue] = useState(0);

  const wrap = useCallback(async () => {
    const weth = new ethers.Contract(
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      ['function deposit() payable external'],
      signer
    );

    await sendTx(weth, 'deposit', [], {
      value: getContractReadableAmount(value, 18),
    });
  }, [signer, sendTx, value]);

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      background="bg-umbra"
      classes={{ paper: 'rounded-2xl m-0' }}
      showCloseIcon
    >
      <Box className="flex flex-col space-y-2">
        <Typography variant="h5">Wrap ETH</Typography>
        <Box className="flex space-x-2 justify-end">
          <Typography variant="h6" color="stieglitz">
            Balance:{' '}
          </Typography>
          <Typography variant="h6" color="stieglitz">
            {formatAmount(
              getUserReadableAmount(Number(userAssetBalances['WETH']), 18),
              10
            )}{' '}
            WETH
          </Typography>
        </Box>
        <Input
          onChange={(e) => setValue(Number(e.target.value))}
          type="number"
          placeholder="0.0"
          className="border border-carbon p-2"
          value={value}
          leftElement={null}
          fullWidth
        />
        <CustomButton size="medium" onClick={wrap} color="mineshaft">
          Wrap
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default Wrapper;
