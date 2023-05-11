import { useState } from 'react';

import { MerkleDistributor__factory } from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';

import CustomButton from 'components/UI/Button';
import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import BalanceTree from 'utils/merkle/balance-tree';

import airdropAddresses from 'constants/json/airdropAddresses.json';

interface Props {
  open: boolean;
  handleClose: any;
}

const ClaimRdpxModal = ({ open, handleClose }: Props) => {
  const { accountAddress, signer, contractAddresses } = useBoundStore();

  const [rdpx, setRdpx] = useState<null | string>(null);

  const sendTx = useSendTx();

  const handleClick = async () => {
    if (!signer || !accountAddress) return;

    const index = airdropAddresses.findIndex(
      (item) => item.account.toLowerCase() === accountAddress?.toLowerCase()
    );

    // @ts-ignore
    const amount = index !== -1 ? airdropAddresses[index].amount : '0';

    const tree = new BalanceTree(airdropAddresses);

    if (index >= 0) {
      const merkleDistributorContract = MerkleDistributor__factory.connect(
        contractAddresses['MerkleDistributor'],
        signer
      );

      if (!rdpx || rdpx === '0') {
        try {
          await merkleDistributorContract.callStatic.claim(
            index,
            accountAddress,
            amount,
            tree.getProof(index, accountAddress, amount)
          );
          setRdpx(amount);
        } catch {
          setRdpx('0');
        }
      } else {
        await sendTx(merkleDistributorContract, 'claim', [
          index,
          accountAddress,
          amount,
          tree.getProof(index, accountAddress, amount),
        ]);
        setRdpx(null);
        handleClose();
      }
    } else {
      setRdpx('0');
    }
  };

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Typography variant="h3" className="mb-4">
        Claim rDPX
      </Typography>
      <Box className="flex flex-col space-y-6">
        <Typography variant="h5" component="p">
          Click the below button to check if you have rDPX to claim
        </Typography>
        {rdpx !== null ? (
          Number(rdpx) > 0 ? (
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
        <CustomButton size="large" fullWidth onClick={handleClick}>
          Claim
        </CustomButton>
      </Box>
    </Dialog>
  );
};

export default ClaimRdpxModal;
