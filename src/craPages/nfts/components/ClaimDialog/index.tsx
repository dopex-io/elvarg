import { useContext, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import cx from 'classnames';
import { utils as ethersUtils } from 'ethers';
import noop from 'lodash/noop';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import CircularProgress from '@material-ui/core/CircularProgress';
import { BaseNFT__factory } from '@dopex-io/sdk';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import BalanceTree from 'utils/merkle/balance-tree';
import sendTx from 'utils/contracts/sendTx';

import { WalletContext } from 'contexts/Wallet';

import dopexBridgoorAddresses from 'constants/dopexBridgoorAddresses.json';
import dopexHalloweenAddresses from 'constants/dopexHalloweenAddresses.json';

const ClaimModal = ({ open, handleClose, nft, name }) => {
  const { accountAddress, signer, contractAddresses } =
    useContext(WalletContext);

  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const addresses =
    nft === 'DopexBridgoorNFT'
      ? dopexBridgoorAddresses
      : dopexHalloweenAddresses;

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
    const index = addresses.findIndex(
      (item) =>
        item.account.toLowerCase() === formik.values.address.toLowerCase()
    );

    const availableAmount = index !== -1 ? addresses[index].amount : '0';

    const tree = new BalanceTree(addresses);

    if (index >= 0) {
      const dopexBaseNft = BaseNFT__factory.connect(
        contractAddresses[nft],
        signer
      );

      if (!amount || amount === '0') {
        try {
          setLoading(true);
          await dopexBaseNft.callStatic.claim(
            index,
            formik.values.address,
            availableAmount,
            tree.getProof(index, formik.values.address, availableAmount)
          );
          setLoading(false);
          setAmount(availableAmount);
        } catch {
          setAmount('0');
          setLoading(false);
        }
      } else {
        setLoading(true);
        try {
          await sendTx(
            dopexBaseNft.claim(
              index,
              formik.values.address,
              availableAmount,
              tree.getProof(index, formik.values.address, availableAmount)
            )
          );
          setLoading(false);
        } catch {
          setLoading(false);
        }
        setAmount(null);
        handleClose();
      }
    } else {
      setAmount('0');
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
    else if (amount !== null && amount > 0)
      return { disabled: false, children: 'Claim' };
    else return { disabled: false, children: 'Check' };
  }, [isAddressError, formik.errors.address, amount, loading, accountAddress]);

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Typography variant="h3" className="mb-4">
        Claim {name}
      </Typography>
      <Box className="flex flex-col space-y-6">
        <Typography variant="h5" component="p">
          Enter an address to check if you can mint the NFT
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
        {amount !== null ? (
          amount > 0 ? (
            <Typography variant="h4" className="text-wave-blue">
              {amount} NFT available to Mint!
            </Typography>
          ) : (
            <Typography variant="h4" className="text-red-400">
              No NFT available to Mint.
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

export default ClaimModal;
