import { MouseEventHandler, useReducer, useState, useEffect, useCallback } from 'react';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { styled } from '@mui/material/styles';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButtonV2';
import ApproveDepositButton from 'components/common/ApproveDepositButton';
import Typography from 'components/UI/Typography';
import Button from 'components/UI/Button';
import {
  DialogRow,
  LiquidityDialogRow,
  NumberLiquidityDialogRow,
} from 'components/common/LpCommon/Table';

import { LpPosition } from 'store/Vault/olp';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { DECIMALS_TOKEN, DECIMALS_STRIKE, DECIMALS_USD, MAX_VALUE } from 'constants/index';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';
import { Addresses, ERC20__factory, ERC721__factory } from '@dopex-io/sdk';
import { Dialog } from 'components/UI';

interface Props {
  anchorEl: null | HTMLElement;
  setAnchorEl: Function;
}

export default function BorrowDialog({anchorEl, setAnchorEl}: Props) {
  const sendTx = useSendTx();
  const {
    lendingData,
    accountAddress,
    signer,
    chainId
  } = useBoundStore();


  const [assetApproved, setAssetApproved] = useState<boolean>(false);
  const [userAssetBalance, setUserAssetBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );

  const [rawFillAmount, setRawFillAmount] = useState<string>('1');

  const handleAssetApprove = useCallback(async () => {
    if (!signer) return;
    try {
      const token = await ERC20__factory.connect(
        '', // TODO
        signer
      );
      await sendTx(token, 'approve', ['0x0', MAX_VALUE]);
      setAssetApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, lendingData]);

  return (
    <Dialog
      open={anchorEl != null}
      handleClose={() => setAnchorEl(null)}
      disableScrollLock={true}
      sx={{
        '.MuiPaper-root': {
          padding: '12px',
        },
      }}
      width={368}
    >
      <Box className="bg-cod-gray rounded-lg">
        <Box className="flex justify-between items-center mb-2">
          {/* TODO */}
          <Typography variant="h5">Borrow {}</Typography>
        </Box>
      </Box>
    </Dialog>
  )
}
