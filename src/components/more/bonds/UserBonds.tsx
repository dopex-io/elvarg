/** @jsxImportSource @emotion/react */
import { useContext, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CustomButton from 'components/UI/CustomButton';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import format from 'date-fns/format';
import Button from '@mui/material/Button';
import displayAddress from 'utils/general/displayAddress';
import { DpxBondsContext } from 'contexts/Bonds';
import { WalletContext } from 'contexts/Wallet';
import { css } from '@emotion/react';

type UserBondsProps = {
  handleModal: () => void;
};

export const UserBonds = ({ handleModal }: UserBondsProps) => {
  const {
    dpxPrice,
    epochDiscount,
    userDpxBondsState,
    withdrawDpx,
    depositPerNft,
  } = useContext(DpxBondsContext);

  const { accountAddress, ensAvatar, ensName, connect } =
    useContext(WalletContext);

  const handleWalletConnect = useCallback(() => {
    connect && connect();
  }, [connect]);

  const notRedeemedBonds = useMemo(() => {
    return (
      (userDpxBondsState &&
        userDpxBondsState.filter((bond: any) => bond?.redeemed == false)) ||
      []
    );
  }, [userDpxBondsState]);

  const availableBondsForWithdraw = useMemo(() => {
    return (
      (userDpxBondsState &&
        userDpxBondsState.filter(
          (bond: any) => new Date().valueOf() - bond.maturityTime * 1000 >= 0
        )) ||
      []
    );
  }, [userDpxBondsState]);

  let lockedUntil = notRedeemedBonds[0]?.maturityTime;

  const availableForWithdraw = useMemo(() => {
    return (
      (lockedUntil &&
        new Date().valueOf() - new Date(lockedUntil * 1000).valueOf()) ||
      0
    );
  }, [lockedUntil]);

  const priceWithDiscount = useMemo(() => {
    return getUserReadableAmount(
      dpxPrice - dpxPrice * (epochDiscount / 100),
      6
    );
  }, [dpxPrice, epochDiscount]);

  return (
    <Box className="mt-5">
      <Typography variant="h5">Your Bonds</Typography>
      {accountAddress ? (
        notRedeemedBonds.length > 0 ? (
          <Box>
            <Box className="bg-cod-gray border-b border-umbra rounded-t-lg max-w-[728px] mt-3 p/-3">
              <Button
                variant="text"
                className="bg-mineshaft text-white border-cod-gray hover:border-wave-blue border border-solid"
              >
                {ensAvatar && (
                  <img src={ensAvatar} className="w-5 mr-2" alt="ens avatar" />
                )}
                {ensName ? ensName : displayAddress(accountAddress)}
              </Button>
            </Box>
            <Box className="bg-cod-gray rounded-b-lg flex flex-wrap max-w-[728px] mb-5">
              <Box className="p-3 flex-2 lg:flex-1 border-r border-umbra w-2/4">
                <Box className="text-stieglitz mb-3 ">DPX Available</Box>
                <Box>
                  {(
                    (notRedeemedBonds.length * depositPerNft) /
                    priceWithDiscount
                  ).toFixed(2)}
                  <span className="bg-[#C3F8FF] rounded-sm text-xs text-black font-bold p-0.5 ml-1">
                    DPX
                  </span>
                </Box>
              </Box>
              <Box className="p-3 lg:flex-1 border-t border-r lg:border-t-0 border-umbra w-2/4">
                <Box className="text-stieglitz mb-3">Unlocked</Box>
                <Box>
                  {(availableBondsForWithdraw.length * depositPerNft) /
                    priceWithDiscount}
                  <span className="bg-[#C3F8FF] rounded-sm text-xs text-black font-bold  p-0.5 ml-1">
                    DPX
                  </span>
                </Box>
              </Box>
              <Box className="p-3 lg:flex-1 border-r lg:border-t-0 border-umbra w-2/4">
                <Box className="text-stieglitz mb-3">Locked Until</Box>
                {lockedUntil &&
                  format(new Date(lockedUntil * 1000), 'MM/dd/yyyy')}
              </Box>
              <Box className="p-3 m-auto text-center lg:flex-1 lg:border-r border-b lg:border-b-0 border-umbra w-2/4">
                <Box>
                  <Box
                    css={css`
                      background: linear-gradient(
                        318.43deg,
                        #002eff -7.57%,
                        #22e1ff 100%
                      );
                      border-radius: 5px;
                      color: white;
                      padding: 8px;
                      width: 80%;
                      margin: auto;
                      text-align: center;
                      cursor: not-allowed;
                    `}
                    className={`${availableForWithdraw < 0 && 'grayscale'}`}
                    onClick={() => availableForWithdraw > 0 && withdrawDpx()}
                  >
                    Withdraw
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box className="border flex m-auto justify-center border-umbra rounded-2xl p-3 max-w-[728px] mt-5">
            You have no vested DPX.
            <Typography
              variant="h5"
              className="text-[#22E1FF] ml-2"
              onClick={handleModal}
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
