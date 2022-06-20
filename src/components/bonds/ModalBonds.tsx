import { useState, useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import LaunchIcon from '@mui/icons-material/Launch';
import LinearProgress from '@mui/material/LinearProgress';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import Input from 'components/UI/Input';
import { DpxBondsContext } from 'contexts/Bonds';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';

export interface ModalBondsProps {
  modalOpen: boolean;
  handleModal: () => void;
}

const BondsInfo = ({ title, value }: { title: string; value: string }) => {
  return (
    <Box className="flex mb-3">
      <Typography
        variant="caption"
        className="text-xs text-stieglitz ml-0 mr-auto flex"
      >
        {title}
      </Typography>
      <Box className="text-right">
        <Typography variant="caption" className="text-white mr-auto ml-0 flex">
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export const ModalBonds = ({ modalOpen, handleModal }: ModalBondsProps) => {
  const {
    dopexBridgoorNFTBalance,
    maxDepositsPerEpoch,
    usdcBalance,
    dpxPrice,
    dpxBondsAddress,
    epochDiscount,
    depositUSDC,
  } = useContext(DpxBondsContext);
  let deposited = maxDepositsPerEpoch / 4;
  const [err, setErr] = useState('');
  const [inputValue, setValue] = useState(0);
  let priceWithDiscount = getUserReadableAmount(
    dpxPrice - dpxPrice * (epochDiscount / 100),
    6
  );
  let walletLimit = 5000 * dopexBridgoorNFTBalance;

  const handleMax = () => {
    setValue(walletLimit);
  };

  const handleChange = (e: any) => {
    let value = e.target.value;
    setErr('');
    if (isNaN(Number(value))) {
      setErr('Please only enter numbers');
    } else if (value > walletLimit) {
      setErr('Cannot deposit more than wallet limit');
    } else {
      setValue(value);
    }
  };
  console.log('price with discount', priceWithDiscount);
  return (
    <Dialog
      PaperProps={{ style: { backgroundColor: 'transparent' } }}
      open={modalOpen}
      onClose={handleModal}
    >
      <Box className="bg-cod-gray rounded-2xl p-4  md:w-[343px] ">
        <Box className="flex mb-3">
          <Typography className="flex-1 pt-2" variant="h5">
            Bond
          </Typography>
          <Box className="bg-mineshaft text-white test-xs p-2 rounded-md mr-3">
            Bridgoor x {dopexBridgoorNFTBalance}
          </Box>
          <CloseIcon
            className="fill-current text-white mt-3"
            onClick={handleModal}
          />
        </Box>
        <Input
          leftElement={
            <Box className="mr-2 flex space-x-2">
              <img
                src="/images/tokens/usdc.svg"
                alt="usdc"
                className="w-8 h-8"
              />
              <CustomButton
                size="small"
                color="secondary"
                className="bg-mineshaft px-5 min-w-0 text-xs"
                onClick={handleMax}
              >
                MAX
              </CustomButton>
            </Box>
          }
          bottomElement={
            <div className="flex">
              <Typography
                className="flex-1"
                variant="caption"
                color="stieglitz"
              >
                Balance:
              </Typography>
              <Typography variant="caption" color="white">
                {getUserReadableAmount(usdcBalance, 6)} USDC
              </Typography>
            </div>
          }
          placeholder={inputValue.toString()}
          onChange={handleChange}
        />
        {err && (
          <Box className="bg-[#FF617D] rounded-2xl mt-3 p-2">
            <AccessibleForwardIcon /> {err}
          </Box>
        )}

        <Box className="flex mt-3">
          <Box className="flex-1 bg-cod-gray  border border-[#1E1E1E] p-2">
            <Typography variant="caption" className="text-white  pt-3">
              {inputValue / priceWithDiscount || '-'}
            </Typography>
            <Box className="text-stieglitz pb-3 justify-between items-center">
              To DPX
            </Box>
          </Box>
          <Box className="flex-1  bg-cod-gray  border border-[#1E1E1E] p-2">
            <Typography variant="caption" className="text-white  pt-3">
              {epochDiscount} %
            </Typography>
            <Box className="text-stieglitz">Discount</Box>
          </Box>
        </Box>
        <Box className="border border-[#1E1E1E] p-3">
          <BondsInfo
            title="Bonding Price"
            value={`${getUserReadableAmount(dpxPrice, 6)} USDC`}
          />
          <BondsInfo title="Oracle Price" value="416 USDC" />
          <BondsInfo title="Vesting Term" value="1 Week" />
          <BondsInfo
            title="Total Bonding Limit"
            value={`${getUserReadableAmount(
              deposited,
              6
            )} / ${getUserReadableAmount(maxDepositsPerEpoch, 6)}`}
          />
          <LinearProgress
            variant="determinate"
            value={(deposited / maxDepositsPerEpoch) * 100}
          />
        </Box>
        <Box className="bg-umbra p-4 rounded-xl mt-3">
          <EstimatedGasCostButton gas={500000} chainId={42161} />
          <Box className="flex mb-2 mt-2">
            <Typography
              variant="caption"
              className="text-stieglitz mr-auto flex"
            >
              Contract <LaunchIcon className="w-3 ml-1 pb-2" />
            </Typography>
            <Box className="text-xs text-white">
              {dpxBondsAddress?.slice(0, 5)}
            </Box>
          </Box>
          <Box className="flex">
            <Typography
              variant="caption"
              className=" text-xs text-stieglitz mr-auto flex"
            >
              Wallet Limit <HelpOutlineIcon className="w-3 ml-1 pb-2" />
            </Typography>
            <Box className="text-[#22E1FF] text-xs">{walletLimit}</Box>
          </Box>
        </Box>
        <CustomButton
          variant="text"
          size="small"
          color="umbra"
          className="text-white bg-primary hover:bg-primary w-full mt-5  p-4"
          disabled={inputValue ? false : true}
          onClick={() => depositUSDC(inputValue)}
        >
          {inputValue ? 'Bond' : 'Select Amount'}
        </CustomButton>
      </Box>
    </Dialog>
  );
};
