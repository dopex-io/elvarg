import { useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CustomButton from 'components/UI/CustomButton';
import { DpxBondsContext } from 'contexts/Bonds';

type UserBondsProps = {
  accountAddress: string | undefined;
  handleModal: () => void;
};

export const UserBonds = ({ accountAddress, handleModal }: UserBondsProps) => {
  const { epochNumber, epochExpiry, epochStartTime, dopexBondsNftBalance } =
    useContext(DpxBondsContext);

  return (
    <Box className="mt-5">
      <Typography variant="h5">Your Bonds</Typography>
      {accountAddress ? (
        dopexBondsNftBalance ? (
          <Box>
            <Box className="bg-cod-gray border-b border-[#1E1E1E] rounded-t-lg md:w-[728px] mt-3 p-3">
              <Box className="bg-mineshaft text-white test-xs p-1 rounded-md mr-3 w-[110px]">
                Jams.eth
              </Box>
            </Box>
            <Box className="bg-cod-gray rounded-b-lg flex flex-wrap md:w-[728px] mb-5">
              <Box className="p-3 flex-2 md:flex-1 border-r border-[#1E1E1E] w-2/4">
                <Box className="text-stieglitz mb-3 ">DPX Available</Box>
                <Box>
                  36.55{' '}
                  <span className="bg-[#C3F8FF] rounded-sm text-xs text-black font-bold p-0.5">
                    DPX
                  </span>
                </Box>
              </Box>
              <Box className="p-3 md:flex-1 md:border-r border-b md:border-b-0 border-[#1E1E1E] w-2/4">
                <Box className="text-stieglitz mb-3">Vested</Box>
                <Box>
                  209 / 350
                  <span className="bg-[#C3F8FF] rounded-sm text-xs text-black font-bold p-0.5">
                    DPX
                  </span>
                </Box>
              </Box>
              <Box className="p-3 md:flex-1 border-t border-r md:border-t-0 border-[#1E1E1E] w-2/4">
                <Box className="text-stieglitz mb-3">Unlocked</Box>
                <Box>
                  0
                  <span className="bg-[#C3F8FF] rounded-sm text-xs text-black font-bold  p-0.5">
                    DPX
                  </span>
                </Box>
              </Box>
              <Box className="p-3 md:flex-1">
                <Box className="text-stieglitz mb-3">Locked Until</Box>
                08-01-2022
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
