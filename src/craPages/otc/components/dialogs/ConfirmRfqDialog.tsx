import { useContext, useCallback, useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import { BigNumber } from 'ethers';
import { ERC20, ERC20__factory, Escrow, Escrow__factory } from '@dopex-io/sdk';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import { WalletContext } from 'contexts/Wallet';
import sendTx from 'utils/contracts/sendTx';
// import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

interface ConfirmRfqDialogProps {
  open: boolean;
  handleClose: () => void;
  amount: string;
  price: string;
  option: string;
  isBuy: boolean;
  token?: ERC20;
}

const ConfirmRfqDialog = ({
  open,
  handleClose,
  option,
  amount,
  price,
  isBuy,
  token,
}: ConfirmRfqDialogProps) => {
  const { accountAddress, provider, signer, contractAddresses } =
    useContext(WalletContext);

  const [approved, setApproved] = useState(false);

  const handleApprove = useCallback(async () => {
    const quote = isBuy
      ? ERC20__factory.connect(contractAddresses.USDT, provider)
      : token;
    const escrow = Escrow__factory.connect(contractAddresses.Escrow, provider);
    await sendTx(
      quote.connect(signer).approve(escrow.address, isBuy ? price : amount)
    ).catch((e) => {
      console.log(e);
    });
    setApproved(!approved);
  }, [
    isBuy,
    contractAddresses,
    provider,
    signer,
    token,
    price,
    amount,
    approved,
  ]);

  const handleConfirmOrder = useCallback(async () => {
    const quote = isBuy
      ? ERC20__factory.connect(contractAddresses.USDT, provider)
      : token;

    const base = !isBuy
      ? ERC20__factory.connect(contractAddresses.USDT, provider)
      : token;

    const escrow = Escrow__factory.connect(contractAddresses.Escrow, provider);

    const allowance = await quote.allowance(
      isBuy ? quote.address : base.address,
      accountAddress
    );

    if (allowance > BigNumber.from(price))
      await sendTx(
        escrow
          .connect(signer)
          .deposit(
            quote.address,
            base.address,
            isBuy ? price : amount,
            isBuy ? amount : price
          )
      );
  }, [
    amount,
    price,
    provider,
    contractAddresses,
    token,
    isBuy,
    accountAddress,
    signer,
  ]);

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Box className="flex flex-col space-y-4">
        <Typography variant="h5">Confirm Trade</Typography>
        <Box className="flex flex-col space-y-2 bg-umbra rounded-lg p-2">
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Option
            </Typography>
            <Typography variant="h6">{option}</Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Quantity
            </Typography>
            <Typography variant="h6">{amount}</Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Price
            </Typography>
            <Typography variant="h6">{price}</Typography>
          </Box>
          <Box className="flex justify-between">
            <Typography variant="h6" className="text-stieglitz">
              Order Type
            </Typography>
            <Typography variant="h6">{isBuy ? 'Buy' : 'Sell'}</Typography>
          </Box>
        </Box>
        <Box className="border border-umbra rounded-xl p-2">
          <Typography variant="h6" className="text-stieglitz text-center">
            By confirming this transaction, you will deposit your collateral to
            an escrow & create an open order to be fulfilled by a counter-party.
            You can withdraw your funds at any time before completion of the
            trade.
          </Typography>
        </Box>
        <Box className="flex space-x-2">
          <CustomButton
            size="medium"
            className="w-1/2"
            disabled={!approved}
            onClick={handleConfirmOrder}
          >
            Confirm
          </CustomButton>
          <CustomButton
            size="medium"
            className="w-1/2"
            disabled={approved}
            onClick={handleApprove}
          >
            Approve
          </CustomButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ConfirmRfqDialog;
