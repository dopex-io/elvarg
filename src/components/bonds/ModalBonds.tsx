import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import axios from 'axios';
import { ERC20__factory } from '@dopex-io/sdk';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import LaunchIcon from '@mui/icons-material/Launch';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import useSendTx from 'hooks/useSendTx';
import { BigNumber } from 'ethers';

import Input from 'components/UI/Input';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';

import { DpxBondsContext } from 'contexts/Bonds';
import { WalletContext } from 'contexts/Wallet';

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

  const { handleMint, dpxBondsData, dpxBondsUserEpochData, dpxBondsEpochData } =
    useContext(DpxBondsContext);
  const { signer, /*contractAddresses,*/ accountAddress, provider, chainId } =
    useContext(WalletContext);

  const { dpxBondsAddress } = dpxBondsData;
  const { bondPrice, depositPerNft } = dpxBondsEpochData;
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
      const _amount = BigNumber.from(amount).mul(depositPerNft);
      const _usdc = ERC20__factory.connect(
        // contractAddresses['USDC'],
        '0x96979F70aDe814fBc53B3cebC5d2fCf3FE8A7381', // Mock USDC
        provider
      );
      const allowance = await _usdc.allowance(accountAddress, dpxBondsAddress);

      if (_amount.lte(allowance)) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    })();
  }, [
    accountAddress,
    // contractAddresses,
    depositPerNft,
    dpxBondsAddress,
    amount,
    provider,
  ]);

  const handleMax = useCallback(() => {
    setAmount(usableNfts.length);
  }, [usableNfts.length]);

  const handleChange = useCallback(
    (e: any) => {
      let value = e.target.value;

      setErr('');
      setAmount(value);
      if (isNaN(Number(value))) {
        setErr('Please only enter numbers');
      } else if (value > usableNfts.length) {
        setErr('Cannot deposit more than wallet limit');
      }
    },
    [usableNfts.length]
  );

  const handleApprove = useCallback(async () => {
    if (
      amount === 0 ||
      !signer // || !contractAddresses
    )
      return;

    const usdc = ERC20__factory.connect(
      '0x96979F70aDe814fBc53B3cebC5d2fCf3FE8A7381', // contractAddresses['USDC'],
      signer
    );

    try {
      await sendTx(usdc.approve(dpxBondsAddress, MAX_VALUE));
      setApproved(true);
    } catch (e) {
      console.log(e);
    }
  }, [dpxBondsAddress, amount, sendTx, signer /* contractAddresses */]);

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
      <Box className="bg-cod-gray rounded-2xl p-4  w-[343px] ">
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
          USDC Required: {amount * 5000}
        </Typography>
        {err && (
          <Box className="bg-[#FF617D] rounded-2xl mt-3 p-2">
            <AccessibleForwardIcon /> {err}
          </Box>
        )}
        <Box className="flex mt-3">
          <Box className="w-1/2 bg-cod-gray border border-umbra p-2">
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
        <CustomButton
          variant="text"
          size="small"
          color={amount ? '' : 'umbra'}
          className="text-white bg-primary hover:bg-primary w-full mt-5  p-4"
          disabled={amount ? false : true}
          onClick={submitButton[approved ? 'DEPOSIT' : 'APPROVE'].handleClick}
        >
          {submitButton[approved ? 'DEPOSIT' : 'APPROVE'].text}
        </CustomButton>
      </Box>
    </Dialog>
  );
};
