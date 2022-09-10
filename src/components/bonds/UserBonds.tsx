import { useContext, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import Tooltip from '@mui/material/Tooltip';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import format from 'date-fns/format';

import InfoTooltip from 'components/UI/InfoTooltip';
import CustomButton from 'components/UI/Button';

import displayAddress from 'utils/general/displayAddress';

import { DpxBondsContext } from 'contexts/Bonds';
import { WalletContext } from 'contexts/Wallet';

type UserBondsProps = {
  handleModal: () => void;
};

export const UserBonds = ({ handleModal }: UserBondsProps) => {
  const { dpxBondsUserEpochData, dpxBondsEpochData, handleRedeem } =
    useContext(DpxBondsContext);

  const { userDpxBondsState } = dpxBondsUserEpochData;
  const { depositPerNft, bondPrice } = dpxBondsEpochData;

  const { accountAddress, ensAvatar, ensName, connect } =
    useContext(WalletContext);

  const handleWalletConnect = useCallback(() => {
    connect && connect();
  }, [connect]);

  const notRedeemedBonds = useMemo(() => {
    return (
      (userDpxBondsState &&
        userDpxBondsState.filter((bond) => bond?.redeemed == false)) ||
      []
    );
  }, [userDpxBondsState]);

  return (
    <Box className="mt-5">
      <Typography variant="h5">Your Bonds</Typography>
      {accountAddress ? (
        notRedeemedBonds.length > 0 ? (
          <Box className="rounded-lg bg-cod-gray max-w-[728px] pb-1">
            <Box className="bg-cod-gray border-b border-umbra mt-3 flex justify-between p-3 rounded-t-lg">
              <CustomButton
                variant="text"
                color="mineshaft"
                className="text-white border-cod-gray hover:border-wave-blue border border-solid"
              >
                {ensAvatar && (
                  <img src={ensAvatar} className="w-5 mr-2" alt="ens avatar" />
                )}
                {ensName ? ensName : displayAddress(accountAddress)}
              </CustomButton>
              <Tooltip title={`Redeem maturated bonds`} arrow>
                <CustomButton onClick={handleRedeem}>Redeem</CustomButton>
              </Tooltip>
            </Box>
            <Box className="flex bg-cod-gray border-b border-umbra">
              <Box className="p-3 flex-2 lg:flex-1 border-umbra">
                <Typography variant="h5" color="stieglitz" className="my-auto">
                  DPX Available
                </Typography>
              </Box>
              <Box className="p-3 flex lg:flex-1 border-umbra space-x-1">
                <Typography variant="h5" color="stieglitz" className="my-auto">
                  Issue Date
                </Typography>
                <InfoTooltip
                  title="Date & time of minting your bond"
                  id="locked-until"
                  iconClassName="h-5 w-5"
                  className="my-auto"
                />
              </Box>
              <Box className="p-3 flex lg:flex-1 border-umbra space-x-1">
                <Typography variant="h5" color="stieglitz" className="my-auto">
                  Locked Until
                </Typography>
                <InfoTooltip
                  title="You cannot redeem until the maturation period"
                  id="locked-until"
                  iconClassName="h-5 w-5"
                  className="my-auto"
                />
              </Box>
            </Box>
            {notRedeemedBonds.map((bond, index) => (
              <Box className="bg-cod-gray flex flex-wrap mb-5" key={index}>
                <Box className="p-3 flex-2 lg:flex-1 border-umbra w-1/2">
                  <Typography variant="h5">
                    {(
                      getUserReadableAmount(depositPerNft, 6) /
                      getUserReadableAmount(bondPrice, 6)
                    ).toFixed(2)}
                    <span className="bg-[#C3F8FF] rounded-sm text-xs text-black font-bold p-0.5 ml-1">
                      DPX
                    </span>
                  </Typography>
                </Box>
                <Box className="p-3 flex-2 lg:flex-1 border-umbra w-1/2">
                  <Typography variant="h5">
                    {format(new Date(bond.issued * 1000), 'EEE d LLL h:mmbb')}
                  </Typography>
                </Box>
                <Box className="p-3 lg:flex-1 lg:border-t-0 border-umbra w-1/2">
                  <Typography variant="h5">
                    {bond.maturityTime &&
                      format(
                        new Date(bond.maturityTime * 1000),
                        'EEE d LLL h:mmbb'
                      )}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box className="border flex m-auto justify-center border-umbra rounded-2xl p-3 max-w-[728px] mt-5">
            You have no vested DPX.
            <Typography
              variant="h5"
              className="text-[#22E1FF] ml-2"
              onClick={handleModal}
              role="button"
            >
              Bond Now
            </Typography>
          </Box>
        )
      ) : (
        <Box className="border border-umbra rounded-2xl p-3 flex max-w-[728px] mt-5">
          <Box className="flex-1">
            <AccountBalanceWalletIcon /> Connect your wallet to see your bonds
          </Box>
          <CustomButton
            variant="text"
            size="small"
            className="text-white bg-primary hover:bg-primary"
            onClick={handleWalletConnect}
          >
            Connect {accountAddress}
          </CustomButton>
        </Box>
      )}
    </Box>
  );
};
