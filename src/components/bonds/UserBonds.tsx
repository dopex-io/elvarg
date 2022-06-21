import { useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CustomButton from 'components/UI/CustomButton';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import format from 'date-fns/format';
import styles from './styles.module.scss';
import Button from '@mui/material/Button';
import displayAddress from 'utils/general/displayAddress';
import { DpxBondsContext } from 'contexts/Bonds';
import { WalletContext } from 'contexts/Wallet';

type UserBondsProps = {
  handleModal: () => void;
};

export const UserBonds = ({ handleModal }: UserBondsProps) => {
  const {
    epochNumber,
    dpxPrice,
    epochDiscount,
    dopexBondsNftBalance,
    userDpxBondsState,
  } = useContext(DpxBondsContext);

  const { accountAddress, ensAvatar, ensName } = useContext(WalletContext);

  let userBondsPerSelectedEpoch = userDpxBondsState.filter(
    (bond: any) => bond?.epoch == epochNumber
  );
  let lockedUntil = userBondsPerSelectedEpoch[0]?.maturityTime;

  let priceWithDiscount = getUserReadableAmount(
    dpxPrice - dpxPrice * (epochDiscount / 100),
    6
  );

  return (
    <Box className="mt-5">
      <Typography variant="h5">Your Bonds</Typography>
      {accountAddress ? (
        dopexBondsNftBalance ? (
          <Box>
            <Box className="bg-cod-gray border-b border-[#1E1E1E] rounded-t-lg md:w-[728px] mt-3 p-3">
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
            <Box className="bg-cod-gray rounded-b-lg flex flex-wrap md:w-[728px] mb-5">
              <Box className="p-3 flex-2 md:flex-1 border-r border-[#1E1E1E] w-2/4">
                <Box className="text-stieglitz mb-3 ">DPX Available</Box>
                <Box>
                  {(dopexBondsNftBalance * 5000) / priceWithDiscount}
                  <span className="bg-[#C3F8FF] rounded-sm text-xs text-black font-bold p-0.5 ml-1">
                    DPX
                  </span>
                </Box>
              </Box>
              <Box className="p-3 md:flex-1 border-t border-r md:border-t-0 border-[#1E1E1E] w-2/4">
                <Box className="text-stieglitz mb-3">Unlocked</Box>
                <Box>
                  0
                  <span className="bg-[#C3F8FF] rounded-sm text-xs text-black font-bold  p-0.5 ml-1">
                    DPX
                  </span>
                </Box>
              </Box>
              <Box className="p-3 md:flex-1 border-r md:border-t-0 border-[#1E1E1E] w-2/4">
                <Box className="text-stieglitz mb-3">Locked Until</Box>
                {lockedUntil &&
                  format(new Date(lockedUntil * 1000), 'MM/dd/yyyy')}
              </Box>
              <Box className="p-3 text-center md:flex-1 md:border-r border-b md:border-b-0 border-[#1E1E1E] w-2/4">
                <Box>
                  <CustomButton
                    variant="text"
                    size="small"
                    className={`${styles['button']} mt-5`}
                    disabled
                    // onClick={handleModal}
                  >
                    Withdraw
                  </CustomButton>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box className="border border-[#1E1E1E] rounded-2xl p-3 md:w-[728px] mt-5">
            <div className="text-center">
              You have no vested DPX.
              <span className="text-[#22E1FF]" onClick={handleModal}>
                Bond Now
              </span>
            </div>
          </Box>
        )
      ) : (
        <Box className="border border-[#1E1E1E] rounded-2xl p-3 flex w-[728px] mt-5">
          <div className="flex-1">
            <AccountBalanceWalletIcon /> Connect your wallet to see your bonds
          </div>
          <CustomButton
            variant="text"
            size="small"
            className="text-white bg-primary hover:bg-primary"
          >
            Connect {accountAddress}
          </CustomButton>
        </Box>
      )}
    </Box>
  );
};
