import { useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import { DpxBondsContext } from 'contexts/Bonds';
import SearchIcon from '@mui/icons-material/Search';
import { WalletContext } from 'contexts/Wallet';
import Chip from '@mui/material/Chip';
import Input from 'components/UI/Input';

export interface EligibilityCheckProps {
  eligibilityModal: boolean;
  handleEligibilityModal: () => void;
}

export const EligibilityCheck = ({
  eligibilityModal,
  handleEligibilityModal,
}: EligibilityCheckProps) => {
  const { accountAddress } = useContext(WalletContext);
  const { usableNfts, dopexBridgoorNFTBalance, bridgoorNFTIds } =
    useContext(DpxBondsContext);
  const usedNfts = bridgoorNFTIds.filter(
    (id: number) => usableNfts.indexOf(id) == -1
  );

  return (
    <Dialog
      PaperProps={{ style: { backgroundColor: 'transparent' } }}
      open={eligibilityModal}
      onClose={handleEligibilityModal}
    >
      <Box className="bg-cod-gray rounded-2xl p-4 pt-2  md:w-[343px] ">
        <Box className="flex mb-3">
          <Typography className="flex-1 pt-3" variant="h5">
            Check Eligibility
          </Typography>
          <Box className="bg-mineshaft text-white test-xs p-1 rounded-md mr-3 mt-2 flex">
            <img
              className="w-[22px] h-[22px] mr-2 mt-1"
              src="/images/nfts/DopexBridgoorNFT.gif"
            ></img>
            Bridgoor × {dopexBridgoorNFTBalance}
          </Box>
          <CloseIcon
            className="fill-current text-white mt-3"
            onClick={handleEligibilityModal}
          />
        </Box>
        <Box className="bg-[#1E1E1E] rounded-2xl p-2 mt-5 pb-5">
          <div className="text-[#8E8E8E] text-xs pt-1 mb-2">Search by ID</div>
          <Box className="h-[36px]">
            <Input
              leftElement={<SearchIcon className="text-[#8E8E8E]" />}
              sx={{
                fontSize: '14px !important',
                height: '30px !important',
              }}
              placeholder="ex: 1"
              className="my-0 py-1 border border-[#646464]"
            />
          </Box>
        </Box>
        <Box className="bg-[#1E1E1E] rounded-2xl p-2 mt-5 ">
          <Box className="flex">
            <Box className="flex-1 text-[#8E8E8E] text-xs pt-1 mb-4">
              Your eligible NFTs
            </Box>
            <Typography variant="caption">{usableNfts.length}</Typography>
          </Box>
          <Box className="flex overflow-x-auto">
            {usableNfts.map((id: number) => {
              return (
                <Box className="flex-none text-center">
                  <img
                    className="w-[70px] h-[70px] m-1 mb-[-20px]"
                    src="/images/nfts/DopexBridgoorNFT.gif"
                  ></img>
                  <Chip
                    label={`#${id}`}
                    size="small"
                    className="bg-[#1E1E1E] text-white"
                  />
                </Box>
              );
            })}
          </Box>
          <Box className="flex">
            <Box className=" flex-1 text-[#8E8E8E] text-xs pt-1 mb-4">
              Inligible NFTs
            </Box>
            <Typography variant="caption">{usedNfts.length}</Typography>
          </Box>
          <Box className="flex overflow-x-auto">
            {usedNfts.map((id: number) => {
              return (
                <Box className="flex-none text-center">
                  <img
                    className="w-[70px] h-[70px] m-1 mb-[-20px]"
                    src="/images/nfts/DopexBridgoorNFT.gif"
                  ></img>
                  <Chip
                    label={`#${id}`}
                    size="small"
                    className="bg-[#1E1E1E] text-white"
                  />
                </Box>
              );
            })}
          </Box>
        </Box>

        {!accountAddress && (
          <Box className="bg-[#1E1E1E] border border-[#1E1E1E] rounded-2xl p-3 flex  mt-5">
            <div className="flex-1 text-white text-xs pt-1">
              Connect to see your NFTs
            </div>
            <CustomButton
              variant="text"
              size="small"
              className=" text-white text-xs bg-primary hover:bg-primary"
            >
              Connect
            </CustomButton>
          </Box>
        )}
        <Box className=" border border-[#1E1E1E] rounded-2xl p-3 fl/ex  mt-2">
          <Typography className="mb-2" variant="h6">
            About Eligiblity
          </Typography>
          <Typography variant="caption" color="stieglitz">
            Every eligible Bridgoor NFT can only be used once. Always check here
            if IDs from Secondary Markets have already been used.
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};
