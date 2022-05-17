import { useContext, useCallback, useState } from 'react';
import cx from 'classnames';
import Box from '@mui/material/Box';

import { WalletContext } from 'contexts/Wallet';

import Claim from '../../farms/Claim';
import Typography from '../../UI/Typography';
import Button from '@mui/material/Button';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

interface ClaimableProps {
  Icon: any;
  token: any;
  poolName: string;
  className?: string;
}

const MODALS = {
  CLAIM: Claim,
};

const Claimable = ({ token, poolName, className }: ClaimableProps) => {
  const { accountAddress } = useContext(WalletContext);

  const [modalState, setModalState] = useState({
    open: false,
    type: 'CLAIM',
  });
  // @ts-ignore TODO: FIX
  const Modal = MODALS[modalState.type];

  const handleClose = useCallback(
    () => setModalState((prevState) => ({ ...prevState, open: false })),
    []
  );

  const handleClaim = useCallback(
    () => setModalState({ open: true, type: 'CLAIM' }),
    []
  );

  return (
    <Box className={cx('w-full p-1.5 rounded-xl', className)}>
      <Modal
        open={modalState.open}
        handleClose={handleClose}
        data={{
          token,
        }}
      />
      <Box className="w-full">
        {accountAddress && token.rewards ? (
          <Box className="w-full mt-auto">
            {token.rewards[0] > 0 ||
            token.rewards[1] > 0 ||
            token.userStakedBalance > 0 ? (
              <Box>
                <Typography variant="h5" className="mb-2 text-left">
                  <span className="text-stieglitz">{poolName}</span>
                </Typography>

                <Box className="flex w-full">
                  <img src={`/assets/dpx.svg`} className="w-8 h-8" />
                  <Typography variant="h5" className="ml-3 mt-0.5">
                    <span className="text-white">
                      {formatAmount(
                        getUserReadableAmount(token.rewards[0], 18),
                        8
                      )}
                    </span>
                  </Typography>
                </Box>
                <Box className="flex w-full mt-2">
                  <img src={`/assets/rdpx.svg`} className="w-8 h-8" />
                  <Typography variant="h5" className="ml-3 mt-0.5">
                    <span className="text-white">
                      {formatAmount(
                        getUserReadableAmount(token.rewards[1], 18),
                        8
                      )}
                    </span>
                  </Typography>
                </Box>

                <Button
                  onClick={handleClaim}
                  className="bg-umbra hover:bg-umbra hover:opacity-90 text-white mt-4 w-full"
                >
                  Claim
                </Button>
              </Box>
            ) : null}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default Claimable;
