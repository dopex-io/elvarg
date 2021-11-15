import { useContext, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import cx from 'classnames';
import { utils as ethersUtils } from 'ethers';
import noop from 'lodash/noop';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MerkleDistributor__factory } from '@dopex-io/sdk';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import BalanceTree from 'utils/merkle/balance-tree';
import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import sendTx from 'utils/contracts/sendTx';

import { WalletContext } from 'contexts/Wallet';

import airdropAddresses from 'constants/airdropAddresses.json';

const ClaimRdpxModal = ({ open, handleClose }) => {
  const { accountAddress, signer, contractAddresses } =
    useContext(WalletContext);

  const [rdpx, setRdpx] = useState(null);
  const [loading, setLoading] = useState(false);

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
    const index = airdropAddresses.findIndex(
      (item) =>
        item.account.toLowerCase() === formik.values.address.toLowerCase()
    );

    const amount = index !== -1 ? airdropAddresses[index].amount : '0';

    const tree = new BalanceTree(airdropAddresses);

    if (index >= 0) {
      const merkleDistributorContract = MerkleDistributor__factory.connect(
        contractAddresses['MerkleDistributor'],
        signer
      );

      if (!rdpx || rdpx === '0') {
        try {
          setLoading(true);
          await merkleDistributorContract.callStatic.claim(
            index,
            formik.values.address,
            amount,
            tree.getProof(index, formik.values.address, amount)
          );
          setLoading(false);
          setRdpx(amount);
        } catch {
          setRdpx('0');
          setLoading(false);
        }
      } else {
        setLoading(true);
        try {
          await sendTx(
            merkleDistributorContract.claim(
              index,
              formik.values.address,
              amount,
              tree.getProof(index, formik.values.address, amount)
            )
          );
          setLoading(false);
        } catch {
          setLoading(false);
        }
        setRdpx(null);
        handleClose();
      }
    } else {
      setRdpx('0');
    }
  };

  const buttonProps = useMemo(() => {
    if (isAddressError)
      return { disabled: true, children: formik.errors.address };
    else if (loading) {
      return {
        disabled: true,
        children: <CircularProgress size={25} />,
      };
    } else if (!accountAddress)
      return { disabled: true, children: 'Connect Account to Claim' };
    else if (rdpx !== null && rdpx > 0)
      return { disabled: false, children: 'Claim' };
    else return { disabled: false, children: 'Check' };
  }, [isAddressError, formik.errors.address, rdpx, loading, accountAddress]);

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Typography variant="h3" className="mb-4">
        Claim rDPX
      </Typography>
      <Box className="flex flex-col space-y-6">
        <Typography variant="h5" component="p">
          Enter an address to check if there is any rDPX available to claim. You
          can proceed to send a transaction if so.
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
        {rdpx !== null ? (
          rdpx > 0 ? (
            <Typography variant="h4" className="text-wave-blue">
              {formatAmount(getUserReadableAmount(rdpx, 18).toString())} rDPX
              available to claim!
            </Typography>
          ) : (
            <Typography variant="h4" className="text-red-400">
              No rDPX available to claim.
            </Typography>
          )
        ) : null}
        <CustomButton
          size="large"
          fullWidth
          onClick={handleClick}
          disabled={buttonProps.disabled}
        >
          {buttonProps.children}
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default ClaimRdpxModal;
