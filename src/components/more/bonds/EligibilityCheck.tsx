import { useContext, useState } from 'react';
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
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export interface EligibilityCheckProps {
  eligibilityModal: boolean;
  handleEligibilityModal: () => void;
}

const nftList = (listOfNfts: Array<number>) => {
  return (
    <Box className="flex overflow-x-auto">
      {listOfNfts.map((id: number) => {
        return (
          <Box className="flex-none text-center" key={id}>
            <img
              className="w-[70px] h-[70px] m-1 mb-[-20px]"
              src="/images/nfts/DopexBridgoorNFT.gif"
              alt="DopexBridgoorNFT"
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
  );
};

export const EligibilityCheck = ({
  eligibilityModal,
  handleEligibilityModal,
}: EligibilityCheckProps) => {
  const [err, setErr] = useState(false);
  const [eligible, setEligible] = useState(true);
  const [showIcon, setShowIcon] = useState(false);

  const { accountAddress } = useContext(WalletContext);

  const {
    usableNfts,
    dopexBridgoorNFTBalance,
    bridgoorNFTIds,
    getDepositsPerNftId,
  } = useContext(DpxBondsContext);

  const usedNfts = bridgoorNFTIds.filter(
    (id: number) => usableNfts.indexOf(id) == -1
  );

  const handleCheckNft = async (id: number) => {
    let result = await getDepositsPerNftId(id);
    if (result > 0) {
      setEligible(false);
    } else {
      setEligible(true);
    }
    setShowIcon(true);
    return result;
  };

  const handleChange = (e: any) => {
    let value = e.target.value;
    if (value) {
      handleCheckNft(value);
    } else {
      setEligible(true);
      setShowIcon(false);
    }
  };

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
              alt="DopexBridgoorNFT"
            ></img>
            Bridgoor × {dopexBridgoorNFTBalance}
          </Box>
          <CloseIcon
            className="fill-current text-white mt-3"
            onClick={handleEligibilityModal}
          />
        </Box>
        <Box className="bg-[#1E1E1E] rounded-2xl p-2 mt-5 pb-5">
          <Box className="flex">
            <div className="text-[#8E8E8E] text-xs pt-1 mb-2 flex-1">
              Search by ID
              <Tooltip title="NFT token ID can be found under details/info. Use this form to verify the eligibility of the NFT.">
                <HelpOutlineIcon className="h-[14px] mb-0.5" />
              </Tooltip>
            </div>
            {showIcon &&
              (!eligible ? (
                <Tooltip title="This NFT is ineligible because it has been used before in the bonds program.">
                  <Box className="text-white text-xs mt-1 ">
                    Used
                    <ErrorIcon className="text-[#FF617D] mb-0.5 h-[15px]  " />
                  </Box>
                </Tooltip>
              ) : (
                <Tooltip title="This NFT is eligible and has not been used in the bonds program.">
                  <Box className="text-white text-xs mt-1 ">
                    Eligible
                    <CheckCircleIcon className="text-[#6DFFB9] mb-0.5 h-[15px] " />
                  </Box>
                </Tooltip>
              ))}
          </Box>

          <Box className="h-[36px]">
            <Input
              leftElement={<SearchIcon className="text-[#8E8E8E]" />}
              sx={{
                fontSize: '14px !important',
                height: '30px !important',
              }}
              inputProps={{
                pattern: '[0-9]*',
              }}
              placeholder="ex: 1"
              className="my-0 py-1 border border-[#646464]"
              onChange={(e) =>
                e.target.validity.valid ? handleChange(e) : setErr(true)
              }
            />
          </Box>
        </Box>
        {err && (
          <Box className="bg-[#FF617D] rounded-2xl mt-3 p-2">
            <AccessibleForwardIcon /> Please only enter numbers
          </Box>
        )}
        {!accountAddress ? (
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
        ) : (
          <Box className="bg-[#1E1E1E] rounded-2xl p-2 mt-5 ">
            <Box className="flex">
              <Box className="flex-1 text-[#8E8E8E] text-xs pt-1 mb-4">
                Your eligible NFTs
              </Box>
              <Typography variant="caption">{usableNfts.length}</Typography>
            </Box>
            {nftList(usableNfts)}
            <Box className="flex">
              <Box className=" flex-1 text-[#8E8E8E] text-xs pt-1 mb-4">
                Ineligible NFTs
              </Box>
              <Typography variant="caption">{usedNfts.length}</Typography>
            </Box>
            {nftList(usedNfts)}
          </Box>
        )}
        <Box className=" border border-[#1E1E1E] rounded-2xl p-3 fl/ex  mt-2">
          <Typography className="mb-2" variant="h6">
            About Eligibility
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
