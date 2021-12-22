import { useContext, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import cx from 'classnames';
import { utils as ethersUtils } from 'ethers';
import noop from 'lodash/noop';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import sendTx from 'utils/contracts/sendTx';

import { WalletContext } from 'contexts/Wallet';

const TransferModal = ({ open, handleClose, userNftData }) => {
  const { accountAddress } = useContext(WalletContext);

  const [loading, setLoading] = useState(false);
  const { tokenId, balance, nftContractSigner } = userNftData;

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
              {formik.errors.address}
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
