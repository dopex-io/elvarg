import { useCallback } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';

import { WritePositionInterface } from 'store/Vault/ssov';

import CustomButton from 'components/UI/Button';
import Dialog from 'components/UI/Dialog';
import NumberDisplay from 'components/UI/NumberDisplay';
import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import Stat from '../Stat';

export interface Props {
  open: boolean;
  handleClose: () => void;
  data: WritePositionInterface;
}

const WithdrawDialog = ({ open, handleClose, data }: Props) => {
  const { accountAddress, ssovData, ssovSigner, updateSsovV3EpochData } =
    useBoundStore();

  const sendTx = useSendTx();

  const handleWithdraw = useCallback(async () => {
    if (!ssovSigner.ssovContractWithSigner || !accountAddress) return;
    try {
      await sendTx(ssovSigner.ssovContractWithSigner, 'withdraw', [
        data.tokenId,
        accountAddress,
      ]).then(() => {
        updateSsovV3EpochData();
      });
    } catch (e) {
      console.log(e);
    }
  }, [accountAddress, data, sendTx, ssovSigner, updateSsovV3EpochData]);

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      classes={{ paper: 'rounded-2xl m-0' }}
    >
      <div className="flex flex-col">
        <div className="flex flex-row items-center mb-4">
          <IconButton
            className="p-0 pr-3 pb-1"
            onClick={handleClose}
            size="large"
          >
            <ArrowBackIcon
              className="text-stieglitz items-center"
              fontSize="large"
            />
          </IconButton>
          <Typography variant="h3">Withdraw</Typography>
        </div>
        <div className="bg-umbra rounded-md flex flex-col p-4 space-y-4">
          <Stat name="Asset" value={ssovData?.underlyingSymbol} />
          <Stat name="Collateral" value={ssovData?.collateralSymbol} />
          <Stat name="Type" value={ssovData?.isPut ? 'PUT' : 'CALL'} />
          <Stat
            name="Strike Price"
            value={`$${getUserReadableAmount(data.strike, 8)}`}
          />
          <Stat
            name="Deposit Amount"
            value={`${getUserReadableAmount(data.collateralAmount, 18)} ${
              ssovData?.collateralSymbol
            }`}
          />
          <Stat
            name="Accrued Premiums"
            value={
              <>
                <NumberDisplay n={data.accruedPremiums} decimals={18} />{' '}
                {ssovData?.collateralSymbol}
              </>
            }
          />
          <Stat name="Epoch" value={data.epoch.toString()} />
        </div>
        <CustomButton
          className="w-full my-4"
          onClick={handleWithdraw}
          size="large"
        >
          Withdraw
        </CustomButton>
      </div>
    </Dialog>
  );
};

export default WithdrawDialog;
