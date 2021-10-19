import { useContext, useState, useCallback, useMemo } from 'react';
import { Delegator__factory } from '@dopex-io/sdk';
import format from 'date-fns/format';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import { getMessageFromCode } from 'eth-rpc-errors';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import { newEthersTransaction } from 'utils/contracts/transactions';

import { WalletContext } from 'contexts/Wallet';
import { PortfolioContext } from 'contexts/Portfolio';

import { STAT_NAMES } from 'constants/index';

import { DialogProps } from '.';

const Withdraw = ({ closeModal, data, icon }: DialogProps) => {
  const { signer, contractAddresses, blockTime } = useContext(WalletContext);
  const { updateOptionBalances } = useContext(PortfolioContext);

  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const optionsAmount = getUserReadableAmount(data.userBalance, 18);

  const stats = useMemo(() => {
    return {
      strike: '$' + getUserReadableAmount(data.strike, 8).toString(),
      price: '$' + getUserReadableAmount(data.assetPrice, 8).toString(),
      pnl: '$' + formatAmount(data.pnl, 2),
      expiry: format(
        new Date(Number(data.expiry) * 1000),
        'd LLL yyyy'
      ).toLocaleUpperCase(),
      amount: formatAmount(optionsAmount, 5),
    };
  }, [data, optionsAmount]);

  const handleMax = useCallback(async () => {
    setAmount(optionsAmount.toString());
  }, [setAmount, optionsAmount]);

  const handleWithdraw = useCallback(async () => {
    if (Number(amount) <= 0) return setError('Please enter a valid amount.');
    try {
      const delegator = Delegator__factory.connect(
        contractAddresses.Delegator,
        signer
      );
      const fAmount = getContractReadableAmount(amount, 18);

      await newEthersTransaction(
        delegator.withdraw(data.optionsContractId, fAmount)
      );

      closeModal();
      updateOptionBalances();
    } catch (err) {
      console.error(err);
      setError(`Something went wrong. Error: ${getMessageFromCode(err.code)}`);
    }
  }, [
    amount,
    data,
    contractAddresses,
    closeModal,
    updateOptionBalances,
    signer,
  ]);

  return (
    <Box className="flex flex-col">
      <Typography variant="h5" className="mb-3">
        Disable Auto Exercise
      </Typography>
      <Box className="flex flex-col bg-umbra rounded-lg p-4">
        <Box className="flex mb-4">
          <img src={`${icon}`} alt="Symbol" className="w-8 h-8 my-auto" />
          <span className="my-auto px-2 text-white">{data.asset}</span>
          <span className="text-xs text-white bg-mineshaft rounded-md my-auto ml-2 p-2">
            {data.isPut ? 'PUT' : 'CALL'}
          </span>
        </Box>
        <Box className="p-2 rounded-lg flex flex-col text-white">
          <Box className="flex flex-col space-y-4">
            {Object.keys(stats).map((key) => {
              return (
                <Box key={key} className="flex justify-between">
                  <Typography
                    variant="caption"
                    component="div"
                    className="text-stieglitz"
                  >
                    {STAT_NAMES.exercise[key]}
                  </Typography>
                  <Typography variant="caption" component="div">
                    {stats[key]}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
      <Typography
        variant="h6"
        className="text-wave-blue uppercase mt-2 mb-1 ml-1"
        role="button"
        onClick={handleMax}
      >
        Max
      </Typography>
      <Box className="bg-umbra flex flex-row p-4 rounded-xl justify-between mb-4">
        <Input
          disableUnderline={true}
          id="amount"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          className="h-8 text-sm text-white font-mono w-full"
          placeholder="Amount"
        />
      </Box>
      <Typography variant="caption" className="px-3 mb-3 text-red-400">
        {error}
      </Typography>
      <Box className="flex">
        <CustomButton
          size="large"
          disabled={
            blockTime > (Number(data.expiry) - 3600) * 1000 ||
            !amount ||
            Number(amount) === 0
          }
          onClick={handleWithdraw}
          className="w-full p-5 bottom-0 rounded-md ml-0.5"
        >
          Disable
        </CustomButton>
      </Box>
    </Box>
  );
};

export default Withdraw;
