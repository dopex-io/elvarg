import { ERC20 } from '@dopex-io/sdk';
import Box from '@mui/material/Box';

import Dialog from 'components/UI/Dialog';

import Swap from './Swap';
import Claim from './Claim';
import Exercise from './Exercise';
import Transfer from './Transfer';
import Delegate from './Delegate';
import Withdraw from './Withdraw';

import { OptionActionTypeEnum } from 'types';

interface OptionActionDialogProps {
  open: boolean;
  type: OptionActionTypeEnum;
  data: {
    strike: string;
    userBalance: string;
    expiry: string;
    asset: string;
    isPut: boolean;
    optionsContract: ERC20;
    optionsContractId: string;
    assetPrice: string;
    pnl?: number;
    claimAmount?: string;
    userClaimAmount?: number;
  };
  icon: string;
  closeModal: () => void;
}

export interface DialogProps
  extends Omit<OptionActionDialogProps, 'open' | 'type'> {}

const OptionActionDialog = (props: OptionActionDialogProps) => {
  const { open, type, closeModal, data, icon } = props;

  const actionProps = {
    closeModal,
    data,
    icon,
  };

  const actionComponent = {
    TRANSFER: <Transfer {...actionProps} />,
    EXERCISE: <Exercise {...actionProps} />,
    AUTOEXERCISE: <Delegate {...actionProps} />,
    WITHDRAW: <Withdraw {...actionProps} />,
    CLAIM: <Claim {...actionProps} />,
    SWAP: <Swap {...actionProps} />,
  };

  return (
    <Dialog open={open} handleClose={closeModal} showCloseIcon>
      <Box>{actionComponent[type]}</Box>
    </Dialog>
  );
};

export default OptionActionDialog;
