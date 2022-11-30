import { useState, useEffect, useCallback, useMemo } from 'react';
// import axios from 'axios';
import { BigNumber } from 'ethers';
import { ERC20__factory } from '@dopex-io/sdk';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import LaunchIcon from '@mui/icons-material/Launch';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import Typography from 'components/UI/Typography';
import Input from 'components/UI/Input';
import CustomButton from 'components/UI/Button';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import WhiteLockerIcon from 'svgs/icons/WhiteLockerIcon';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import displayAddress from 'utils/general/displayAddress';
import formatAmount from 'utils/general/formatAmount';

import { CHAIN_ID_TO_EXPLORER, MAX_VALUE } from 'constants/index';

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

  const {
    signer,
    contractAddresses,
    accountAddress,
    provider,
    chainId,
    bondsContracts,
    dpxBondsData,
    dpxBondsUserEpochData,
    dpxBondsEpochData,
  } = useBoundStore();

  const { dpxBondsAddress, usdcBalance } = dpxBondsData;
  const { bondPrice, depositPerNft, maxEpochDeposits, totalEpochDeposits } =
    dpxBondsEpochData;
  const { usableNfts } = dpxBondsUserEpochData;

  const [err, setErr] = useState('');
  const [amount, setAmount] = useState(0);
  const [dpxOraclePrice, setOraclePrice] = useState(0);
  const [approved, setApproved] = useState(false);

  const percentageDiscount = useMemo(() => {
    const dpxPrice = getUserReadableAmount(dpxOraclePrice, 8);
    const priceDiff = Math.abs(getUserReadableAmount(bondPrice, 6) - dpxPrice);
    return (priceDiff / dpxPrice) * 100;
  }, [bondPrice, dpxOraclePrice]);

  const isMintable = useMemo(() => {
    if (!maxEpochDeposits || !totalEpochDeposits) return;
    return totalEpochDeposits.lt(maxEpochDeposits);
  }, [maxEpochDeposits, totalEpochDeposits]);

  useEffect(() => {
    async function getData() {
      const dpxPrice = 22803000000;

      setOraclePrice(dpxPrice);
    }
    getData();
  }, []);

  useEffect(() => {
    (async () => {
      if (
        !dpxBondsAddress ||
        !provider ||
        !accountAddress ||
        !amount ||
        !contractAddresses
      )
        return;
      try {
        const _amount = BigNumber.from(amount).mul(depositPerNft);
        const _usdc = ERC20__factory.connect(
          contractAddresses['USDC'],
          provider
        );
        const allowance = await _usdc.allowance(
          accountAddress,
          dpxBondsAddress
        );
        setApproved(_amount.lte(allowance));
      } catch (e) {
        console.log(e);
      }
    })();
  }, [
    accountAddress,
    contractAddresses,
    depositPerNft,
    dpxBondsAddress,
    amount,
    provider,
  ]);

  useEffect(() => {
    setErr(usdcBalance.lt(depositPerNft) ? 'Insufficient USDC Balance' : '');
  }, [depositPerNft, usdcBalance]);

  useEffect(() => {
    (async () => {
      if (amount === 0 || !signer || !contractAddresses || !accountAddress)
        return;
      try {
        const usdc = ERC20__factory.connect(contractAddresses['USDC'], signer);
        const allowance = await usdc.allowance(accountAddress, dpxBondsAddress);

        setApproved(
          allowance.gte(depositPerNft.mul(BigNumber.from(amount || '0')))
        );
      } catch (e) {
        console.log(e);
      }
    })();
  }, [
    accountAddress,
    amount,
    contractAddresses,
    depositPerNft,
    dpxBondsAddress,
    signer,
  ]);

  const handleMax = useCallback(() => {
    setAmount(usableNfts.length);
  }, [usableNfts.length]);

  const handleChange = useCallback(
    (e: any) => {
      let value = e.target.value;
      setErr('');
      setAmount(value);
      if (usdcBalance.lt(depositPerNft)) setErr('Insufficient USDC Balance');
      else if (isNaN(Number(value))) {
        setErr('Please only enter numbers');
      } else if (value > usableNfts.length) {
        setErr('Cannot deposit more than wallet limit');
      }
    },
    [depositPerNft, usableNfts.length, usdcBalance]
  );

  const handleApprove = useCallback(async () => {
    if (amount === 0 || !signer || !contractAddresses) return;

    const usdc = ERC20__factory.connect(contractAddresses['USDC'], signer);

    try {
      await sendTx(usdc.approve(dpxBondsAddress, MAX_VALUE));
      setApproved(true);
    } catch (e) {
      console.log(e);
    }
  }, [dpxBondsAddress, amount, sendTx, signer, contractAddresses]);

  const handleMint = useCallback(
    async (amount: number) => {
      if (
        !bondsContracts ||
        !signer ||
        dpxBondsUserEpochData.usableNfts.length === 0
      )
        return;

      try {
        await sendTx(
          bondsContracts.bondsContract
            .connect(signer)
            .mint(dpxBondsUserEpochData.usableNfts.slice(0, amount))
        );
      } catch (e) {
        console.log(e);
      }
    },
    [bondsContracts, dpxBondsUserEpochData.usableNfts, sendTx, signer]
  );

  const handleDeposit = useCallback(async () => {
    if (!handleMint) return;

    await handleMint(amount);
    handleModal();
  }, [handleMint, handleModal, amount]);

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
      <Box className="bg-cod-gray rounded-2xl p-4 w-[343px]">
        <Typography className="flex-1 pt-2 mb-4" variant="h5">
          Bond
        </Typography>
        <Input
          leftElement={
            <Box className="mr-2 flex space-x-2">
              <img
                className="w-[30px] h-[30px] mr-2 mt-1"
                src="/images/nfts/DopexBridgoorNFT.gif"
                alt="DopexBridgoorNFT"
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
                {usableNfts.length} Bridgoors
              </Typography>
            </Box>
          }
          value={amount}
          type="number"
          size="small"
          onChange={handleChange}
        />
        <Typography variant="caption" color="wave-blue" className="mt-2">
          USDC Required: {amount * getUserReadableAmount(depositPerNft, 6)}
        </Typography>
        {err && (
          <Box className="bg-down-bad rounded-xl mt-3 p-2 text-center">
            <AccessibleForwardIcon /> {err}
          </Box>
        )}
        <Box className="flex mt-3">
          <Box className="w-1/2 bg-cod-gray border rounded-tl-xl border-umbra p-2">
            <Typography variant="h5" className="text-[#22E1FF] pt-3 h-[40px]">
              {amount ? (
                <ArrowForwardIcon className="text-[#3E3E3E] w-[20px] mr-1 mb-1" />
              ) : null}
              {amount
                ? formatAmount(
                    (amount * getUserReadableAmount(depositPerNft, 6)) /
                      getUserReadableAmount(bondPrice, 6),
                    3
                  )
                : '-'}
            </Typography>
            <Typography variant="h5" className="p-2" color="stieglitz">
              To DPX
            </Typography>
          </Box>
          <Box className="w-1/2 bg-cod-gray border rounded-tr-xl border-umbra p-2">
            <Typography variant="h5" className="text-white  pt-3 h-[40px]">
              {formatAmount(percentageDiscount, 2)}
              {} %
            </Typography>
            <Box className="text-stieglitz">Discount</Box>
          </Box>
        </Box>
        <Box className="border rounded-b-xl border-umbra p-3 pt-6">
          <BondsInfo
            title="Bonding Price"
            value={`${getUserReadableAmount(bondPrice, 6)} USDC`}
          />
          <BondsInfo title="Vesting Term" value="1 Week" />
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
        </Box>
        {!isMintable ? (
          <Box className="flex justify-center bg-umbra p-2 rounded-lg mt-3 mx-auto space-x-2 cursor-not-allowed">
            <WhiteLockerIcon className="my-auto" color="#8E8E8E" />
            <Typography variant="h5" color="stieglitz">
              Sold out
            </Typography>
          </Box>
        ) : (
          <CustomButton
            variant="text"
            size="small"
            color={amount ? '' : 'umbra'}
            className="text-white bg-primary hover:bg-primary w-full mt-3 p-4"
            disabled={amount ? false : true}
            onClick={submitButton[approved ? 'DEPOSIT' : 'APPROVE'].handleClick}
          >
            {submitButton[approved ? 'DEPOSIT' : 'APPROVE'].text}
          </CustomButton>
        )}
      </Box>
    </Dialog>
  );
};
