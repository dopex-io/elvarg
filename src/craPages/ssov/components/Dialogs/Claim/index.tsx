import { useCallback, useContext } from 'react';
import { SSOVDelegator__factory } from '@dopex-io/sdk';
import Box from '@material-ui/core/Box';

import { SsovContext } from 'contexts/Ssov';
import { WalletContext } from 'contexts/Wallet';

import CustomButton from 'components/UI/CustomButton';
import Dialog from 'components/UI/Dialog';

import sendTx from 'utils/contracts/sendTx';

const Claim = ({ open, handleClose, strikeIndex, token }) => {
  const context = useContext(SsovContext);

  const { signer, contractAddresses } = useContext(WalletContext);

  const {
    selectedEpoch,
    ssovData: { epochStrikes },
  } = context[token.toLocaleLowerCase()];

  const handleClaim = useCallback(async () => {
    const delegatorAddress =
      token === 'DPX'
        ? contractAddresses.SSOV.DPX.SSOVDelegator
        : contractAddresses.SSOV.RDPX.SSOVDelegator;

    const delegator = SSOVDelegator__factory.connect(delegatorAddress, signer);

    await sendTx(
      delegator.claim(
        selectedEpoch,
        epochStrikes[strikeIndex],
        await signer.getAddress()
      )
    );
  }, [
    contractAddresses,
    epochStrikes,
    selectedEpoch,
    signer,
    strikeIndex,
    token,
  ]);

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Box className="flex flex-col bg-umbra rounded-lg p-4">
        <Box className="flex">
          <CustomButton
            size="large"
            onClick={handleClaim}
            className="w-full p-5 bottom-0 rounded-md ml-0.5 mt-2"
          >
            Claim
          </CustomButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default Claim;
