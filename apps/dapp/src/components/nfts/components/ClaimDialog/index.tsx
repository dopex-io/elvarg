import { SetStateAction, useMemo, useState } from 'react';

import { BaseNFT } from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Input from '@mui/material/Input';
import cx from 'classnames';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';

import CustomButton from 'components/UI/Button';
import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import MarketplaceLink from 'components/nfts/components/MarketplaceLink';

import BalanceTree from 'utils/merkle/balance-tree';

import dopexBridgoorAddresses from 'constants/json/dopexBridgoorAddresses.json';
import dopexHalloweenAddresses from 'constants/json/dopexHalloweenAddresses.json';
import dopexSantasAddresses from 'constants/json/dopexSantasAddresses.json';

interface ClaimDialogProps {
  open: boolean;
  handleClose: () => void;
  index: number;
  name: string;
  symbol: string;
}

const ClaimDialog = (props: ClaimDialogProps) => {
  const { open, handleClose, index, name, symbol } = props;

  const { accountAddress, userNftsData } = useBoundStore();

  const sendTx = useSendTx();

  const [amount, setAmount] = useState<string | number>(0);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const NAME_TO_ADDRESSES_ARRAY: {
    [key: string]: { account: string; amount: string }[];
  } = {
    'Dopex Bridgoor NFT': dopexBridgoorAddresses,
    'Dopex Halloween NFT': dopexHalloweenAddresses,
    'Dopex Santas NFT': dopexSantasAddresses,
  };
  const addresses = NAME_TO_ADDRESSES_ARRAY[name];

  const {
    nftContractSigner,
  }: {
    nftContractSigner: BaseNFT | null | undefined;
  } = useMemo(() => {
    if (userNftsData.length === 0) {
      return {
        nftContractSigner: null,
      };
    } else {
      return {
        nftContractSigner: userNftsData[index]?.nftContractSigner,
      };
    }
  }, [userNftsData, index]);

  const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
    setAddress(e.target.value);
  };

  const handleClick = async () => {
    if (!nftContractSigner || !addresses) return;

    const index = addresses.findIndex(
      (item) => item.account.toLowerCase() === address.toLowerCase()
    );
    const availableAmount = index !== -1 ? addresses[index]?.amount : '0';

    const tree = new BalanceTree(addresses);

    if (index >= 0) {
      if (!amount || amount === '0') {
        try {
          setLoading(true);
          await nftContractSigner.callStatic.claim(
            index,
            address,
            availableAmount ?? '0',
            tree.getProof(index, address, availableAmount)
          );
          setLoading(false);
          setAmount(availableAmount ?? '0');
        } catch {
          setAmount(0);
          setLoading(false);
        }
      } else {
        setLoading(true);
        try {
          await sendTx(nftContractSigner, 'claim', [
            index,
            address,
            availableAmount ?? '0',
            tree.getProof(index, address, availableAmount),
          ]);
          setLoading(false);
        } catch {
          setLoading(false);
        }
        setAmount(0);
        handleClose();
      }
    } else {
      setAmount('0');
    }
  };

  const buttonProps = useMemo(() => {
    if (loading) {
      return {
        disabled: true,
        children: <CircularProgress size={25} />,
      };
    } else if (!accountAddress)
      return { disabled: true, children: 'Connect Account to Claim' };
    else if (amount !== null && Number(amount) > 0)
      return { disabled: false, children: 'Claim' };
    else return { disabled: false, children: 'Check' };
  }, [amount, loading, accountAddress]);

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
          <Box className={cx('bg-umbra p-3 rounded-xl mb-1')}>
            <Input
              disableUnderline={true}
              name="address"
              value={address}
              onChange={handleChange}
              className="h-9 text-lg text-white ml-2 w-full"
              placeholder="Enter address"
              classes={{ input: 'text-white' }}
            />
          </Box>
        </Box>
        {amount !== null ? (
          Number(amount) > 0 ? (
            <Typography variant="h4" className="text-wave-blue">
              {amount} NFT available to Mint!
            </Typography>
          ) : (
            <Typography variant="h4" className="text-red-400">
              No NFT available to Mint.
            </Typography>
          )
        ) : null}
        <Box>
          <MarketplaceLink
            label="Buy on Opensea"
            id={symbol}
            marketId="opensea"
          />
          <MarketplaceLink
            label="Buy on TofuNFT"
            id={symbol}
            marketId="tofunft"
          />
        </Box>
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

export default ClaimDialog;
