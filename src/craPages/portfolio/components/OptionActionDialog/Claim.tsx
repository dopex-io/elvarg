import { useContext, useState, useCallback, useMemo } from 'react';
import format from 'date-fns/format';
import { getMessageFromCode } from 'eth-rpc-errors';
import Box from '@mui/material/Box';
import { Delegator__factory } from '@dopex-io/sdk';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import useSendTx from 'hooks/useSendTx';

import { WalletContext } from 'contexts/Wallet';
import { PortfolioContext } from 'contexts/Portfolio';

import { BASE_ASSET_MAP, STAT_NAMES } from 'constants/index';

import { DialogProps } from '.';

const Claim = ({ closeModal, data, icon }: DialogProps) => {
  const { accountAddress, contractAddresses, signer } =
    useContext(WalletContext);
  const { updateOptionBalances } = useContext(PortfolioContext);

  const [error, setError] = useState('');

  const sendTx = useSendTx();

  const stats = useMemo(() => {
    return {
      strike: '$' + getUserReadableAmount(data.strike, 8).toString(),
      price: '$' + getUserReadableAmount(data.assetPrice, 8).toString(),
      pnl: '$' + formatAmount(data.userClaimAmount, 2),
      expiry: format(
        new Date(Number(data.expiry) * 1000),
        'd LLL yyyy'
      ).toLocaleUpperCase(),
      amount: formatAmount(getUserReadableAmount(data.userBalance, 18), 5),
    };
  }, [data]);

  const handleClick = useCallback(async () => {
    try {
      const delegator = Delegator__factory.connect(
        contractAddresses.Delegator,
        signer
      );

      await sendTx(delegator.claim(data.optionsContractId, accountAddress));

      closeModal();
      updateOptionBalances();
    } catch (err) {
      console.error(err);
      setError(`Something went wrong. Error: ${getMessageFromCode(err.code)}`);
    }
  }, [
    contractAddresses,
    signer,
    accountAddress,
    closeModal,
    updateOptionBalances,
    data,
    sendTx,
  ]);

  return (
    <Box className="flex flex-col">
      <Typography variant="h5" className="mb-3">
        Claim P&L
      </Typography>
      <Box className="flex flex-col bg-umbra rounded-lg p-4 mb-4">
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
                  <Typography
                    variant="caption"
                    component="div"
                    className={key === 'pnl' ? 'text-emerald-500' : ''}
                  >
                    {stats[key]}
                  </Typography>
                </Box>
              );
            })}
          </Box>
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
        Claim ${data.userClaimAmount}
      </CustomButton>
    </Box>
  );
};

export default Claim;
