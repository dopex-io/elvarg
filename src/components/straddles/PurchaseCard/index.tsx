import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BigNumber } from 'ethers';
import { ERC20__factory } from '@dopex-io/sdk';

import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Tooltip from '@mui/material/Tooltip';

import useSendTx from 'hooks/useSendTx';

import { WalletContext } from 'contexts/Wallet';
import { StraddlesContext } from 'contexts/Straddles';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import NumberDisplay from 'components/UI/NumberDisplay';

import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import CalculatorIcon from 'svgs/icons/CalculatorIcon';

import formatAmount from 'utils/general/formatAmount';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

import { MAX_VALUE } from 'constants/index';

const PurchaseCard = () => {
  const { chainId, accountAddress, signer, contractAddresses } =
    useContext(WalletContext);
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(
    BigNumber.from('0')
  );
  const {
    straddlesEpochData,
    straddlesData,
    updateStraddlesEpochData,
    updateStraddlesUserData,
  } = useContext(StraddlesContext);

  const maxStraddlesCanBeBought = useMemo(() => {
    const availableUsdDeposits = straddlesEpochData?.usdDeposits.sub(
      straddlesEpochData?.activeUsdDeposits.div('100000000000000000000')
    );

    if (!availableUsdDeposits) return BigNumber.from(0);
    return availableUsdDeposits!
      .mul(BigNumber.from('100000000000000000000'))
      .div(straddlesEpochData?.currentPrice!);
  }, [straddlesEpochData]);

  const sendTx = useSendTx();

  const [approved, setApproved] = useState(false);

  const [rawAmount, setRawAmount] = useState<string>('1');

  const amount: number = useMemo(() => {
    return parseFloat(rawAmount) || 0;
  }, [rawAmount]);

  // Handle Purchase
  const handlePurchase = useCallback(async () => {
    if (
      !straddlesData ||
      !accountAddress ||
      !signer ||
      !updateStraddlesEpochData ||
      !updateStraddlesUserData
    )
      return;

    try {
      await sendTx(
        straddlesData.straddlesContract
          .connect(signer)
          .purchase(getContractReadableAmount(amount, 18), accountAddress)
      );
      await updateStraddlesUserData();
      await updateStraddlesEpochData();
    } catch (err) {
      console.log(err);
    }
  }, [
    accountAddress,
    straddlesData,
    signer,
    sendTx,
    amount,
    updateStraddlesUserData,
    updateStraddlesEpochData,
  ]);

  const handleApprove = useCallback(async () => {
    if (!straddlesData || !signer || !contractAddresses) return;
    try {
      await sendTx(
        ERC20__factory.connect(straddlesData.usd, signer).approve(
          straddlesData.straddlesContract.address,
          MAX_VALUE
        )
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [sendTx, signer, straddlesData, contractAddresses]);

  const totalCost: number = useMemo(() => {
    if (!straddlesEpochData?.straddlePrice) return 0;

    return (
      getUserReadableAmount(straddlesEpochData?.straddlePrice!, 26) * amount
    );
  }, [amount, straddlesEpochData]);

  const purchaseButtonMessage: string = useMemo(() => {
    if (!approved) return 'Approve';
    else if (amount == 0) return 'Insert an amount';
    else if (
      getUserReadableAmount(totalCost, 26) >
      getUserReadableAmount(userTokenBalance, 6)
    )
      return 'Insufficient balance';
    else if (!(straddlesData?.isVaultReady! && !straddlesData?.isEpochExpired!))
      return 'Vault not ready';
    else if (amount > getUserReadableAmount(maxStraddlesCanBeBought, 18))
      return 'Insufficient liquidity';
    return 'Purchase';
  }, [
    approved,
    amount,
    totalCost,
    userTokenBalance,
    straddlesData,
    maxStraddlesCanBeBought,
  ]);

  // Updates approved state and user balance
  useEffect(() => {
    (async () => {
      if (!accountAddress || !signer || !straddlesData) return;

      const finalAmount: BigNumber = getContractReadableAmount(amount, 6);
      const token = ERC20__factory.connect(straddlesData.usd, signer);
      const allowance: BigNumber = await token.allowance(
        accountAddress,
        straddlesData?.straddlesContract?.address
      );
      const balance: BigNumber = await token.balanceOf(accountAddress);
      setApproved(allowance.gte(finalAmount));
      setUserTokenBalance(balance);
    })();
  }, [
    contractAddresses,
    accountAddress,
    approved,
    amount,
    signer,
    chainId,
    straddlesData,
  ]);  

  return (
    <Box>
      <Box className="bg-umbra rounded-2xl flex flex-col mb-4 p-3 pr-2">
        <Box className="flex flex-row justify-between">
          <Box className="h-12 bg-cod-gray rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
            <Box className="flex flex-row h-10 w-[130px] p-1">
              <img src={'/images/tokens/eth.svg'} alt={'ETH STRADDLE'} />
              <Typography
                variant="h6"
                className="text-stieglitz text-md font-medium pl-1 pt-1.5 ml-1.5"
              >
                <span className="text-white">Straddle</span>
              </Typography>
            </Box>
          </Box>
          <Input
            disableUnderline
            id="notionalSize"
            name="notionalSize"
            placeholder="0"
            type="number"
            className="h-12 text-2xl text-white ml-2 mr-3 font-mono"
            value={rawAmount}
            onChange={(e) => setRawAmount(e.target.value)}
            classes={{ input: 'text-right' }}
          />
        </Box>
        <Box className="my-1 w-full border-neutral-800">
          <Typography
            variant="h6"
            className="flex justify-between mx-2 pb-2 text-gray-400"
          >
            <div>Max amount of straddles available:</div>
            <div>
              <NumberDisplay
                n={maxStraddlesCanBeBought || BigNumber.from(0)}
                decimals={18}
                decimalsToShow={2}
              />
            </div>
          </Typography>
        </Box>
      </Box>
      <Box className="mt-4 flex justify-center mb-4">
        <Box className="py-2 w-full rounded border border-neutral-800">
          <Typography variant="h6" className="mx-2 text-white">
            {"You'll spend "}
            {formatAmount(totalCost, 6)} USDC
          </Typography>
          <Typography variant="h6" className="mx-2 text-neutral-400">
            Current price is $
            {formatAmount(
              getUserReadableAmount(straddlesEpochData?.straddlePrice!, 26),
              2
            )}
          </Typography>
        </Box>
      </Box>
      <Box className="rounded-lg bg-neutral-800">
        <Box className="p-3">
          <Box className="rounded-md flex flex-col mb-3 p-4 pt-3.5 pb-3.5 border border-neutral-800 w-full bg-mineshaft">
            <EstimatedGasCostButton gas={5000000} chainId={chainId} />
          </Box>
          <Tooltip title="Not available yet">
            <Box className="bg-mineshaft rounded-md flex items-center pr-2 pl-3.5 py-3 cursor-pointer">
              <CalculatorIcon className="w-3 h-3" />
              <Typography variant="h6" className="mx-2 pl-1">
                Payout Calculator
              </Typography>
            </Box>
          </Tooltip>
          <CustomButton
            size="medium"
            className="w-full !rounded-md mt-3"
            color={
              !approved ||
              (amount > 0 &&
                amount <= getUserReadableAmount(maxStraddlesCanBeBought, 18))
                ? 'primary'
                : 'mineshaft'
            }
            disabled={
              !(
                straddlesData?.isVaultReady! &&
                !straddlesData?.isEpochExpired! &&
                amount <= getUserReadableAmount(maxStraddlesCanBeBought, 18)
              )
            }
            onClick={approved ? handlePurchase : handleApprove}
          >
            {purchaseButtonMessage}
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default PurchaseCard;
