import { useCallback, useContext, useMemo } from 'react';
import { SSOVDelegator__factory } from '@dopex-io/sdk';
import Box from '@material-ui/core/Box';

import { SsovContext } from 'contexts/Ssov';
import { WalletContext } from 'contexts/Wallet';

import CustomButton from 'components/UI/CustomButton';
import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';

import sendTx from 'utils/contracts/sendTx';

const Claim = ({ open, handleClose, strikeIndex, ssov }) => {
  const { selectedSsov, ssovDataArray } = useContext(SsovContext);

  const { signer, contractAddresses } = useContext(WalletContext);

  const { selectedEpoch } = ssov;

  const { epochStrikes } = ssovDataArray[selectedSsov];

  const handleClaim = useCallback(async () => {
    const delegatorAddress =
      contractAddresses.SSOV[ssov.tokenName].SSOVDelegator;

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
    ssov.tokenName,
  ]);

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Box className="flex flex-col bg-umbra rounded-lg p-12">
        <Box>
          <Typography variant="h3" className="text-white mb-8">
            Claim Exercised Options
          </Typography>
        </Box>
        <Box>
          <Typography variant="h5" className="mb-4">
            You can claim the pnl for your exercised options from the delegator.
          </Typography>
        </Box>
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
