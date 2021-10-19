import { useContext, useState } from 'react';
import { ERC20__factory, OptionPoolBroker__factory } from '@dopex-io/sdk';
import { ethers, BigNumber } from 'ethers';

import parseError from 'utils/general/parseError';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import { newEthersTransaction } from 'utils/contracts/transactions';
import getTimePeriod from 'utils/contracts/getTimePeriod';

import { AssetsContext } from 'contexts/Assets';
import { WalletContext } from 'contexts/Wallet';
import { PortfolioContext } from 'contexts/Portfolio';

import { MAX_VALUE } from 'constants/index';
import oneEBigNumber from 'utils/math/oneEBigNumber';

const useOptionSwap = (data) => {
  const { usdtContract } = useContext(AssetsContext);
  const { updateOptionBalances } = useContext(PortfolioContext);
  const { accountAddress, contractAddresses, signer } =
    useContext(WalletContext);

  const [loading, setLoading] = useState(false);

  const swapCall = async (
    amountToSwap: string,
    newStrike: number,
    newExpiry: number
  ): Promise<{
    newDoTokens: ethers.BigNumber;
    fee: ethers.BigNumber;
    pnl: ethers.BigNumber;
    error: any;
  }> => {
    if (!signer || !accountAddress)
      return {
        newDoTokens: BigNumber.from(0),
        fee: BigNumber.from(0),
        pnl: BigNumber.from(0),
        error: 'Connect Wallet',
      };
    const optionPoolBroker = OptionPoolBroker__factory.connect(
      contractAddresses.OptionPoolBroker,
      signer
    );

    try {
      const returnValues = await optionPoolBroker.callStatic.optionSwap(
        data.isPut,
        data.expiry,
        (newExpiry / 1000).toString(),
        data.strike,
        getContractReadableAmount(newStrike, 8),
        amountToSwap,
        getTimePeriod('weekly'),
        contractAddresses[data.asset],
        contractAddresses.USDT
      );

      const pnl = data.isPut
        ? BigNumber.from(getContractReadableAmount(newStrike, 8))
            .sub(data.assetPrice)
            .mul(returnValues[0])
            .div(oneEBigNumber(18))
        : BigNumber.from(data.assetPrice)
            .sub(getContractReadableAmount(newStrike, 8))
            .mul(returnValues[0])
            .div(oneEBigNumber(18));

      return {
        newDoTokens: returnValues[0],
        fee: returnValues[1],
        pnl,
        error: '',
      };
    } catch (e) {
      return {
        newDoTokens: BigNumber.from(0),
        fee: BigNumber.from(0),
        pnl: BigNumber.from(0),
        error: parseError(e),
      };
    }
  };

  const swapTransaction = async (
    amountToSwap: string,
    newStrike: number,
    newExpiry: number
  ) => {
    if (!accountAddress || !signer) return;
    setLoading(true);

    const { fee } = await swapCall(amountToSwap, newStrike, newExpiry);

    try {
      // The following code checks for usdt allowance, if its less the fee it max approves the OptionPoolBroker contract to spend any amount of usdt. This done so that no further approves are required saving the user on gas costs.
      const usdtAllowance = await usdtContract.allowance(
        accountAddress,
        contractAddresses.OptionPoolBroker
      );
      if (usdtAllowance.lt(fee)) {
        await newEthersTransaction(
          ERC20__factory.connect(usdtContract.address, signer).approve(
            contractAddresses.OptionPoolBroker,
            MAX_VALUE
          )
        );
      }
      await newEthersTransaction(
        OptionPoolBroker__factory.connect(
          contractAddresses.OptionPoolBroker,
          signer
        ).optionSwap(
          data.isPut,
          data.expiry,
          (newExpiry / 1000).toString(),
          data.strike,
          getContractReadableAmount(newStrike, 8),
          amountToSwap,
          getTimePeriod('weekly'),
          contractAddresses[data.asset],
          contractAddresses.USDT
        )
      );
      setLoading(false);
      updateOptionBalances();
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  return { swapCall, swapTransaction, loading };
};

export default useOptionSwap;
