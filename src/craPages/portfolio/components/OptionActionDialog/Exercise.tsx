import { useContext, useState, useEffect, useMemo } from 'react';
import format from 'date-fns/format';
import { getMessageFromCode } from 'eth-rpc-errors';
import { OptionPoolBroker__factory } from '@dopex-io/sdk';
import Box from '@material-ui/core/Box';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import formatAmount from 'utils/general/formatAmount';
import getValueColorClass from 'utils/general/getValueColorClass';
import parseError from 'utils/general/parseError';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import useSendTx from 'hooks/useSendTx';

import { WalletContext } from 'contexts/Wallet';
import { PortfolioContext } from 'contexts/Portfolio';

import { BASE_ASSET_MAP, STAT_NAMES } from 'constants/index';
import getTimePeriod from 'utils/contracts/getTimePeriod';

import { DialogProps } from '.';

const Exercise = ({ closeModal, data, icon }: DialogProps) => {
  const { accountAddress, contractAddresses, signer } =
    useContext(WalletContext);
  const { updateOptionBalances } = useContext(PortfolioContext);

  const [error, setError] = useState('');

  const sendTx = useSendTx();

  const stats = useMemo(() => {
    return {
      strike: '$' + getUserReadableAmount(data.strike, 8).toString(),
      price: '$' + getUserReadableAmount(data.assetPrice, 8).toString(),
      pnl: '$' + formatAmount(data.pnl, 2),
      expiry: format(
        new Date(Number(data.expiry) * 1000),
        'd LLL yyyy'
      ).toLocaleUpperCase(),
      amount: formatAmount(getUserReadableAmount(data.userBalance, 18), 5),
    };
  }, [data]);

  useEffect(() => {
    async function callExercise() {
      const optionPoolBroker = OptionPoolBroker__factory.connect(
        contractAddresses.OptionPoolBroker,
        signer
      );

      let currentBalance = await data.optionsContract.balanceOf(accountAddress);

      try {
        await sendTx(
          optionPoolBroker.exerciseOption(
            data.isPut,
            data.strike,
            data.expiry,
            currentBalance,
            getTimePeriod('weekly'),
            contractAddresses[data.asset],
            contractAddresses.USDT
          )
        );
      } catch (e) {
        console.log(e);
        setError(parseError(e));
      }
    }
    callExercise();
  }, [accountAddress, signer, data, contractAddresses, sendTx]);

  const handleClick = async () => {
    try {
      const optionPoolBroker = OptionPoolBroker__factory.connect(
        contractAddresses.OptionPoolBroker,
        signer
      );

      let currentBalance = await data.optionsContract.balanceOf(accountAddress);

      await sendTx(
        optionPoolBroker.exerciseOption(
          data.isPut,
          data.strike,
          data.expiry,
          currentBalance,
          getTimePeriod('weekly'),
          contractAddresses[data.asset],
          contractAddresses.USDT
        )
      );

      closeModal();
      updateOptionBalances();
    } catch (err) {
      console.error(err);
      setError(`Something went wrong. Error: ${getMessageFromCode(err.code)}`);
    }
  };

  return (
    <Box className="flex flex-col">
      <Typography variant="h5" className="mb-3">
        Exercise
      </Typography>
      <Box className="flex flex-col bg-umbra rounded-lg p-4">
        <Box className="flex mb-4">
          <img
            src={`${icon}`}
            alt={BASE_ASSET_MAP[data.asset].symbol}
            className="w-8 h-8 my-auto"
          />
          <span className="my-auto px-2 text-white">
            {BASE_ASSET_MAP[data.asset].symbol}
          </span>
          <span className="text-xs text-white bg-mineshaft rounded-md my-auto ml-2 p-2">
            {data.isPut ? 'PUT' : 'CALL'}
          </span>
          <div className="flex-grow px-10" />
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
      <Box className="flex justify-between mt-4 p-4 border border-umbra rounded-lg mb-4">
        <Box>
          <Typography
            variant="h4"
            component="div"
            className={data.pnl ? getValueColorClass(data.pnl) : ''}
          >
            {data.pnl ? '$' + formatAmount(data.pnl, 2) : '--'}
          </Typography>
          <Typography variant="h6" component="div" className="text-stieglitz">
            Return ($)
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="h4"
            component="div"
            className={data.pnl ? getValueColorClass(data.pnl) : ''}
          >
            {data.pnl
              ? formatAmount(
                  (data.pnl /
                    getUserReadableAmount(Number(data.assetPrice), 8)) *
                    100,
                  3
                )
              : '--'}
            %
          </Typography>
          <Typography variant="h6" component="div" className="text-stieglitz">
            Return (%)
          </Typography>
        </Box>
      </Box>

      {error ? (
        <Typography
          variant="caption"
          component="div"
          className="text-down-bad text-center p-4 rounded-xl border-down-bad border mb-4"
        >
          {error}
        </Typography>
      ) : null}

      <CustomButton
        size="large"
        disabled={Boolean(error)}
        onClick={handleClick}
      >
        Exercise
      </CustomButton>
    </Box>
  );
};

export default Exercise;
