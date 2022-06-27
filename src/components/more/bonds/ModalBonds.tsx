import { useState, useEffect, useContext } from 'react';
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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import axios from 'axios';

export interface ModalBondsProps {
  modalOpen: boolean;
  handleModal: () => void;
}

const BondsInfo = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => {
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
    usdcContractBalance,
    dpxPrice,
    dpxBondsAddress,
    epochDiscount,
    depositUSDC,
    usableNfts,
  } = useContext(DpxBondsContext);

  const [err, setErr] = useState('');
  const [inputValue, setValue] = useState(0);
  const [dpxOraclePrice, setOraclePrice] = useState(0);

  useEffect(() => {
    async function getData() {
      const payload = await Promise.all([
        axios.get(
          'https://8iiu5p3f28.execute-api.us-east-2.amazonaws.com/default/fetchPriceUpdates?tokenSymbol=DPX'
        ),
      ]);
      const _dopexOraclesData = payload.map((item) => {
        return item.data.data;
      });
      const dpxPrice =
        _dopexOraclesData[0][_dopexOraclesData[0].length - 1].twap || 0;

      setOraclePrice(dpxPrice);
    }
    getData();
  }, []);

  const walletLimit = 5000 * usableNfts.length;

  const priceWithDiscount = getUserReadableAmount(
    dpxPrice - dpxPrice * (epochDiscount / 100),
    6
  );

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

  const handleDeposit = async () => {
    if (inputValue % 5000 == 0) {
      await depositUSDC(inputValue);
      handleModal();
    } else {
      setErr('Deposit must be divisible by 5000');
    }
  };

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
          <Box className="bg-mineshaft text-white test-xs p-1 rounded-md mr-3 flex">
            <img
              className="w-[22px] h-[22px] mr-2 mt-1"
              src="/images/nfts/DopexBridgoorNFT.gif"
              alt="DopexBridgoorNFT"
            ></img>
            Bridgoor × {dopexBridgoorNFTBalance}
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
          size="small"
          onChange={handleChange}
        />
        {err && (
          <Box className="bg-[#FF617D] rounded-2xl mt-3 p-2">
            <AccessibleForwardIcon /> {err}
          </Box>
        )}

        <Box className="flex mt-3">
          <Box className="flex-1 bg-cod-gray  border border-[#1E1E1E] p-2">
            {inputValue ? (
              <Typography variant="h5" className="text-[#22E1FF] pt-3 h-[40px]">
                <ArrowForwardIcon className="text-[#3E3E3E] w-[20px] mr-1 mb-1" />
                {inputValue / priceWithDiscount}
              </Typography>
            ) : (
              <Typography variant="h5" className="text-white">
                -
              </Typography>
            )}
            <Box className="text-stieglitz pb-3">To DPX</Box>
          </Box>
          <Box className="flex-1  bg-cod-gray  border border-[#1E1E1E] p-2">
            <Typography variant="h5" className="text-white  pt-3 h-[40px]">
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
          <BondsInfo
            title="Oracle Price"
            value={getUserReadableAmount(dpxOraclePrice, 8).toFixed(2)}
          />
          <BondsInfo title="Vesting Term" value="1 Week" />
          <BondsInfo
            title="Total Bonding Limit"
            value={`${getUserReadableAmount(
              usdcContractBalance,
              6
            )} / ${getUserReadableAmount(maxDepositsPerEpoch, 6)}`}
          />
          <LinearProgress
            variant="determinate"
            value={(usdcContractBalance / maxDepositsPerEpoch) * 100}
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
          color={inputValue ? '' : 'umbra'}
          className="text-white bg-primary hover:bg-primary w-full mt-5  p-4"
          disabled={inputValue ? false : true}
          onClick={handleDeposit}
        >
          {inputValue ? 'Bond' : 'Select Amount'}
        </CustomButton>
      </Box>
    </Dialog>
  );
};
