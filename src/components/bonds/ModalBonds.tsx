import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
import { ERC20__factory } from '@dopex-io/sdk';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import LaunchIcon from '@mui/icons-material/Launch';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import useSendTx from 'hooks/useSendTx';

import Input from 'components/UI/Input';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';

import { DpxBondsContext } from 'contexts/Bonds';
import { WalletContext } from 'contexts/Wallet';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import displayAddress from 'utils/general/displayAddress';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { CHAIN_ID_TO_EXPLORER } from 'constants/index';

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
  const sendTx = useSendTx();

  const { handleMint, dpxBondsData, dpxBondsUserEpochData, dpxBondsEpochData } =
    useContext(DpxBondsContext);
  const { signer, /*contractAddresses,*/ accountAddress, provider, chainId } =
    useContext(WalletContext);

  const {
    usdcBalance,
    bridgoorNftBalance,
    dpxBondsAddress,
    maxDepositsPerEpoch,
  } = dpxBondsData;
  const { bondPrice, depositPerNft } = dpxBondsEpochData;
  const { usableNfts } = dpxBondsUserEpochData;

  const [err, setErr] = useState('');
  const [inputValue, setValue] = useState(0);
  const [dpxOraclePrice, setOraclePrice] = useState(0);
  const [approved, setApproved] = useState(false);

  const percentageDiscount = useMemo(() => {
    const dpxPrice = getUserReadableAmount(dpxOraclePrice, 8);
    const priceDiff = Math.abs(getUserReadableAmount(bondPrice, 6) - dpxPrice);
    return (priceDiff / dpxPrice) * 100;
  }, [bondPrice, dpxOraclePrice]);

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

  useEffect(() => {
    (async () => {
      if (
        !dpxBondsAddress ||
        !provider ||
        !accountAddress
        // || !contractAddresses
      )
        return;
      const amount = getContractReadableAmount(inputValue, 6);
      const _usdc = ERC20__factory.connect(
        // contractAddresses['USDC'],
        '0x96979F70aDe814fBc53B3cebC5d2fCf3FE8A7381', // Mock USDC
        provider
      );
      const allowance = await _usdc.allowance(accountAddress, dpxBondsAddress);

      if (amount.lte(allowance)) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    })();
  }, [
    accountAddress,
    // contractAddresses,
    dpxBondsAddress,
    inputValue,
    provider,
  ]);

  const handleMax = useCallback(() => {
    let maxValue = usableNfts.length * getUserReadableAmount(depositPerNft, 6);
    setValue(maxValue);
  }, [depositPerNft, usableNfts.length]);

  const handleChange = useCallback(
    (e: any) => {
      let value = e.target.value;
      const maxValue =
        usableNfts.length * getUserReadableAmount(depositPerNft, 6);
      setErr('');
      setValue(value);
      if (isNaN(Number(value))) {
        setErr('Please only enter numbers');
      } else if (value > maxValue) {
        setErr('Cannot deposit more than wallet limit');
      }
    },
    [depositPerNft, usableNfts.length]
  );

  const handleApprove = useCallback(async () => {
    if (
      inputValue === 0 ||
      !signer // || !contractAddresses
    )
      return;

    const usdc = ERC20__factory.connect(
      '0x96979F70aDe814fBc53B3cebC5d2fCf3FE8A7381', // contractAddresses['USDC'],
      signer
    );

    try {
      await sendTx(
        usdc.approve(dpxBondsAddress, getContractReadableAmount(inputValue, 6))
      );
    } catch (e) {
      console.log(e);
    }
  }, [dpxBondsAddress, inputValue, sendTx, signer /* contractAddresses */]);

  const handleDeposit = useCallback(async () => {
    if (depositPerNft.eq(0) || !handleMint) return;
    let depositReq = getUserReadableAmount(depositPerNft, 6);
    if (inputValue % depositReq == 0) {
      await handleMint();
      handleModal();
    } else {
      setErr(`Deposit must be divisible by ${depositPerNft}`);
    }
    return;
  }, [depositPerNft, handleMint, handleModal, inputValue]);

  const submitButton = {
    DEPOSIT: {
      text: 'Deposit',
      handleClick: handleDeposit,
    },
    APPROVE: {
      text: 'Approve',
      handleClick: handleApprove,
    },
  };

  return (
    <Dialog
      PaperProps={{ style: { backgroundColor: 'transparent' } }}
      open={modalOpen}
      onClose={handleModal}
    >
      <Box className="bg-cod-gray rounded-2xl p-4  w-[343px] ">
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
            Bridgoor × {bridgoorNftBalance.toString()}
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
            <Box className="flex">
              <Typography
                className="flex-1"
                variant="caption"
                color="stieglitz"
              >
                Balance
              </Typography>
              <Typography variant="caption" color="white">
                {getUserReadableAmount(usdcBalance, 6)} USDC
              </Typography>
            </Box>
          }
          value={inputValue}
          type="number"
          size="small"
          onChange={handleChange}
        />
        {err && (
          <Box className="bg-[#FF617D] rounded-2xl mt-3 p-2">
            <AccessibleForwardIcon /> {err}
          </Box>
        )}

        <Box className="flex mt-3">
          <Box className="w-1/2 bg-cod-gray border border-umbra p-2">
            <Typography variant="h5" className="text-[#22E1FF] pt-3 h-[40px]">
              {inputValue ? (
                <ArrowForwardIcon className="text-[#3E3E3E] w-[20px] mr-1 mb-1" />
              ) : null}
              {inputValue
                ? inputValue / getUserReadableAmount(bondPrice, 6)
                : '-'}
            </Typography>
            <Typography variant="h5" className="p-2" color="stieglitz">
              To DPX
            </Typography>
          </Box>
          <Box className="w-1/2 bg-cod-gray  border border-umbra p-2">
            <Typography variant="h5" className="text-white  pt-3 h-[40px]">
              {formatAmount(percentageDiscount, 2)}
              {} %
            </Typography>
            <Box className="text-stieglitz">Discount</Box>
          </Box>
        </Box>
        <Box className="border border-umbra p-3 pt-6">
          <BondsInfo
            title="Bonding Price"
            value={`${getUserReadableAmount(bondPrice, 6)} USDC`}
          />
          <BondsInfo
            title="Oracle Price"
            value={getUserReadableAmount(dpxOraclePrice, 8).toFixed(2)}
          />
          <BondsInfo title="Vesting Term" value="1 Week" />
          <BondsInfo
            title="Total Bonding Limit"
            value={`${getUserReadableAmount(
              usdcBalance,
              6
            )} / ${getUserReadableAmount(maxDepositsPerEpoch, 6)}`}
          />
        </Box>
        <Box className="bg-umbra p-4 rounded-xl mt-3">
          <EstimatedGasCostButton gas={500000} chainId={42161} />
          <Box className="flex mb-2 mt-2">
            <Typography
              variant="caption"
              className="text-stieglitz mr-auto flex"
            >
              Contract
              <a
                href={
                  `${CHAIN_ID_TO_EXPLORER[chainId ?? 42161]}/address/` +
                  dpxBondsAddress
                }
                rel="noopener noreferrer"
                target="_blank"
              >
                <LaunchIcon className="w-3 ml-1 pb-2" />
              </a>
            </Typography>
            <Box className="text-xs text-white">
              {displayAddress(dpxBondsAddress)}
            </Box>
          </Box>
          <Box className="flex">
            <Typography
              variant="caption"
              className=" text-xs text-stieglitz mr-auto flex"
            >
              Wallet Limit
              <Tooltip
                title={` Every Bridgoor NFT increases your cap by an additional ${getUserReadableAmount(
                  depositPerNft,
                  6
                )} USDC for every epoch.`}
              >
                <HelpOutlineIcon className="w-3 ml-1 pb-2" />
              </Tooltip>
            </Typography>
            {/* <Box className="text-[#22E1FF] text-xs">{walletLimit}</Box> */}
          </Box>
        </Box>
        <CustomButton
          variant="text"
          size="small"
          color={inputValue ? '' : 'umbra'}
          className="text-white bg-primary hover:bg-primary w-full mt-5  p-4"
          disabled={inputValue ? false : true}
          onClick={submitButton[approved ? 'DEPOSIT' : 'APPROVE'].handleClick}
        >
          {submitButton[approved ? 'DEPOSIT' : 'APPROVE'].text}
        </CustomButton>
      </Box>
    </Dialog>
  );
};
