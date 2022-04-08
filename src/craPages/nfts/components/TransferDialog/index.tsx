import { useContext, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import cx from 'classnames';
import { utils as ethersUtils, BigNumber } from 'ethers';
import noop from 'lodash/noop';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import { BaseNFT } from '@dopex-io/sdk';

import useSendTx from 'hooks/useSendTx';

import { WalletContext } from 'contexts/Wallet';
import { NftsContext } from 'contexts/Nfts';

const TransferModal = ({ open, handleClose, index }) => {
  const { accountAddress } = useContext(WalletContext);
  const { userNftsData } = useContext(NftsContext);

  const [loading, setLoading] = useState(false);
  const {
    nftContractSigner,
    balance,
    tokenId,
  }: {
    nftContractSigner: BaseNFT;
    balance: BigNumber;
    tokenId: BigNumber;
  } = useMemo(() => {
    if (userNftsData.length === 0) {
      return {
        nftContractSigner: null,
        balance: BigNumber.from(0),
        tokenId: BigNumber.from(0),
      };
    } else {
      return {
        nftContractSigner: userNftsData[index].nftContractSigner,
        balance: userNftsData[index].balance,
        tokenId: userNftsData[index].tokenId,
      };
    }
  }, [userNftsData, index]);

  const sendTx = useSendTx();

  const formik = useFormik({
    initialValues: { address: '' },
    validate: (values) => {
      const errors = { address: '' };
      if (!values.address) {
        errors.address = 'Address is required';
      } else if (!ethersUtils.isAddress(values.address)) {
        errors.address = 'Invalid address';
      }
      return errors;
    },
    onSubmit: noop,
  });

  const isAddressError = useMemo(() => {
    return formik.touched.address && Boolean(formik.errors.address);
  }, [formik.touched.address, formik.errors.address]);

  const handleClick = async () => {
    setLoading(true);
    try {
      await sendTx(
        nftContractSigner.transferFrom(
          accountAddress,
          formik.values.address,
          tokenId
        )
      );
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Typography variant="h3" className="mb-4">
        Balance {balance.toString()}
      </Typography>
      <Box className="flex flex-col space-y-6">
        <Typography variant="h5" component="p">
          Enter an address to transfer the NFT to
        </Typography>
        <Box>
          <Box
            className={cx(
              'bg-umbra p-3 rounded-xl mb-1',
              isAddressError ? 'border border-red-400' : ''
            )}
          >
            <Input
              disableUnderline={true}
              name="address"
              value={formik.values.address}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              className="h-9 text-lg text-white ml-2 w-full"
              placeholder="Enter address"
              classes={{ input: 'text-white' }}
            />
          </Box>
          {isAddressError ? (
            <Typography variant="h5" className="text-red-400">
              {String(formik.errors.address)}
            </Typography>
          ) : null}
        </Box>
        <CustomButton size="large" fullWidth onClick={handleClick}>
          Transfer
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default TransferModal;
