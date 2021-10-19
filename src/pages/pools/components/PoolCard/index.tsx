import { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import cx from 'classnames';
import {
  DopexRewards__factory,
  OptionPoolRebates__factory,
} from '@dopex-io/sdk';

import {
  PoolsContext,
  BaseAssetsOptionPoolSdks,
  BaseAssetsOptionPoolData,
} from 'contexts/Pools';
import { AssetsContext } from 'contexts/Assets';
import { WalletContext } from 'contexts/Wallet';

import WalletButton from 'components/WalletButton';
import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';

import { BASE_ASSET_MAP } from 'constants/index';

import formatAmount from 'utils/general/formatAmount';
import getValueColorClass from 'utils/general/getValueColorClass';
import getValueSign from 'utils/general/getValueSign';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getRebateAmount from 'utils/contracts/getRebateAmount';
import getRewardAmount from 'utils/contracts/getRewardAmount';
import { newEthersTransaction } from 'utils/contracts/transactions';

import usdt from 'assets/tokens/usdt.svg';

import styles from './styles.module.scss';

interface PoolCardProps {
  baseAssetOptionPoolSdk: BaseAssetsOptionPoolSdks;
  baseAssetOptionPoolData?: BaseAssetsOptionPoolData;
  className?: string;
}

function PoolCard(props: PoolCardProps) {
  const { baseAssetOptionPoolSdk, baseAssetOptionPoolData, className } = props;

  const history = useHistory();
  const [state, setState] = useState({
    putPoolReturn: 0,
    callPoolReturn: 0,
  });
  const { selectedEpoch, currentEpoch } = useContext(PoolsContext);
  const { baseAssetsWithPrices } = useContext(AssetsContext);
  const {
    optionPoolSdk,
    baseAsset: selectedBaseAsset,
    baseAssetDecimals: selectedBaseAssetDecimals,
  } = baseAssetOptionPoolSdk;

  const {
    totalUserBasePoolDepositsForEpoch,
    totalUserQuotePoolDepositsForEpoch,
    basePoolDeposits,
    quotePoolDeposits,
    userBaseWithdrawalRequests,
    userQuoteWithdrawalRequests,
  } = baseAssetOptionPoolData
    ? baseAssetOptionPoolData
    : {
        totalUserBasePoolDepositsForEpoch: '0',
        totalUserQuotePoolDepositsForEpoch: '0',
        basePoolDeposits: '0',
        quotePoolDeposits: '0',
        userBaseWithdrawalRequests: '0',
        userQuoteWithdrawalRequests: '0',
      };
  const { handleChangeSelectedBaseAsset, usdtDecimals } =
    useContext(AssetsContext);
  const { accountAddress, provider, contractAddresses, signer } =
    useContext(WalletContext);

  const [rebateAmount, setRebateAmount] = useState<string>('0');
  const [rewardAmount, setRewardAmount] = useState<string>('0');

  const asset = BASE_ASSET_MAP[selectedBaseAsset];

  const baseAssetPrice: number =
    baseAssetsWithPrices && baseAssetsWithPrices[selectedBaseAsset]
      ? getUserReadableAmount(baseAssetsWithPrices[selectedBaseAsset].price, 8)
      : 0;

  const baseWithdrawalRequests = getUserReadableAmount(
    userBaseWithdrawalRequests,
    selectedBaseAssetDecimals
  );

  const quoteWithdrawalRequests = getUserReadableAmount(
    userQuoteWithdrawalRequests,
    usdtDecimals
  );

  const userBasePoolDeposits =
    baseWithdrawalRequests +
    getUserReadableAmount(
      totalUserBasePoolDepositsForEpoch,
      selectedBaseAssetDecimals
    );

  const userQuotePoolDeposits =
    quoteWithdrawalRequests +
    getUserReadableAmount(totalUserQuotePoolDepositsForEpoch, usdtDecimals);

  const totalBasePoolDeposits = getUserReadableAmount(
    basePoolDeposits,
    selectedBaseAssetDecimals
  );

  const totalQuotePoolDeposits = getUserReadableAmount(
    quotePoolDeposits,
    usdtDecimals
  );

  const claimableRebateAmount = getUserReadableAmount(rebateAmount, 18);

  const claimableRewardAmount = getUserReadableAmount(rewardAmount, 18);

  useEffect(() => {
    let isMounted: boolean = true;
    (async function () {
      if (!optionPoolSdk) return;

      const [putPoolReturn, callPoolReturn] = await Promise.all([
        optionPoolSdk.getReturnPercentage(selectedEpoch, true),
        optionPoolSdk.getReturnPercentage(selectedEpoch, false),
      ]);

      if (isMounted) {
        setState({ putPoolReturn, callPoolReturn });
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [optionPoolSdk, accountAddress, selectedEpoch]);

  const claimRebate = useCallback(async () => {
    if (!accountAddress || !signer) return;

    const optionPoolRebates = OptionPoolRebates__factory.connect(
      contractAddresses.OptionPoolRebates,
      signer
    );

    await newEthersTransaction(
      optionPoolRebates.claimUserRebate(optionPoolSdk.address, selectedEpoch)
    );
  }, [accountAddress, selectedEpoch, optionPoolSdk, contractAddresses, signer]);

  const claimReward = useCallback(async () => {
    if (!accountAddress || !signer) return;

    const dopexRewards = DopexRewards__factory.connect(
      contractAddresses.DopexRewards,
      signer
    );

    await newEthersTransaction(
      dopexRewards.claimRewardForOptionPoolLiquidity(
        selectedEpoch,
        optionPoolSdk.address
      )
    );
  }, [signer, accountAddress, selectedEpoch, optionPoolSdk, contractAddresses]);

  useEffect(() => {
    let isMounted: boolean = true;
    (async function () {
      if (!provider || !accountAddress || !contractAddresses) return;
      try {
        const rebateAmount = await getRebateAmount(
          provider,
          contractAddresses,
          optionPoolSdk,
          selectedEpoch,
          accountAddress
        );
        const rewardAmount = await getRewardAmount(
          provider,
          contractAddresses,
          optionPoolSdk,
          selectedEpoch,
          accountAddress
        );
        if (isMounted) {
          setRebateAmount(rebateAmount.toString());
          setRewardAmount(rewardAmount.toString());
        }
      } catch {
        if (isMounted) {
          setRebateAmount('0');
          setRewardAmount('0');
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [
    provider,
    accountAddress,
    optionPoolSdk,
    selectedEpoch,
    contractAddresses,
  ]);

  return (
    <Box className={cx('p-0.5 rounded-xl', styles[selectedBaseAsset])}>
      <Box
        className={cx(
          'flex flex-col bg-cod-gray p-4 rounded-xl w-84 h-full',
          className
        )}
      >
        <Box className="flex flex-row mr-1 justify-between">
          <Box className="flex flex-row">
            <img
              className="w-10 h-10 mt-1"
              src={`/static/svg/tokens/${asset.symbol.toLowerCase()}.svg`}
              alt={selectedBaseAsset}
            />
            <Box className="mr-2 ml-2 h-8 flex flex-col">
              <Typography variant="h5" className="text-white">
                {asset.symbol}
              </Typography>
              <Typography variant="h6" className="w-32 text-stieglitz">
                {asset.fullName}
              </Typography>
            </Box>
          </Box>
          {selectedEpoch <= currentEpoch &&
          userBasePoolDeposits === 0 &&
          userQuotePoolDeposits === 0 ? (
            <Tooltip
              title="Please deposit in the next epoch"
              aria-label="add"
              placement="top"
            >
              <Box>
                <CustomButton
                  size="medium"
                  disabled
                  className="rounded-md h-10 float-right mt-1"
                >
                  Deposit
                </CustomButton>
              </Box>
            </Tooltip>
          ) : (
            <WalletButton
              size="medium"
              className="rounded-md h-10 float-right mt-1"
              onClick={() => {
                handleChangeSelectedBaseAsset(selectedBaseAsset);
                history.push('/pools/manage');
              }}
            >
              {userBasePoolDeposits > 0 ||
              userQuotePoolDeposits > 0 ||
              rebateAmount !== '0'
                ? 'Manage'
                : 'Deposit'}
            </WalletButton>
          )}
        </Box>
        <Box className="mt-4 mb-2 flex flex-row w-full justify-between items-end space-x-2">
          <Box className="flex flex-col border-cod-gray rounded-xl border p-4 w-full bg-umbra">
            <img
              className="w-10 h-10 mb-2"
              src={`/static/svg/tokens/${asset.symbol.toLowerCase()}.svg`}
              alt={selectedBaseAsset}
            />
            <Typography variant="h6" className="text-stieglitz">
              Epoch Return
            </Typography>
            <Typography
              variant="h4"
              className={getValueColorClass(state.putPoolReturn)}
            >
              {getValueSign(state.callPoolReturn)}
              {formatAmount(state.callPoolReturn, 2, false, true)}%
            </Typography>
          </Box>
          <Box className="flex flex-col border-cod-gray rounded-xl border p-4 w-full bg-umbra">
            <img
              className="w-10 h-10 mb-2"
              src={usdt}
              alt={selectedBaseAsset}
            />
            <Typography variant="h6" className="text-stieglitz">
              Epoch Return
            </Typography>
            <Typography
              variant="h4"
              className={getValueColorClass(state.putPoolReturn)}
            >
              {getValueSign(state.putPoolReturn)}
              {formatAmount(state.putPoolReturn, 2, false, true)}%
            </Typography>
          </Box>
        </Box>
        <Box className="flex flex-col w-full border-cod-gray rounded-xl border p-4 bg-umbra h-full">
          <Box className="flex flex-row w-full justify-between items-end ">
            <Typography variant="h6" className="text-stieglitz">
              Deposits
            </Typography>
            <Typography variant="h6">
              {userBasePoolDeposits > 0 || userQuotePoolDeposits > 0 ? (
                <Box>
                  <span className="text-wave-blue">
                    $
                    {formatAmount(
                      userBasePoolDeposits * baseAssetPrice +
                        userQuotePoolDeposits
                    )}
                  </span>
                  {` / $${formatAmount(
                    totalBasePoolDeposits * baseAssetPrice +
                      totalQuotePoolDeposits
                  )}`}
                </Box>
              ) : (
                `$${formatAmount(
                  totalBasePoolDeposits * baseAssetPrice +
                    totalQuotePoolDeposits
                )}`
              )}
            </Typography>
          </Box>
          <Box className="grid grid-cols-2 w-full items-center mt-4">
            <Box className="border-cod-gray rounded-xl border p-4 mr-2 text-center h-full flex flex-col justify-center bg-cod-gray">
              <Typography variant="h6">
                {userBasePoolDeposits > 0 ? (
                  <Box>
                    <span className="text-wave-blue">
                      {formatAmount(userBasePoolDeposits)}
                    </span>
                    {` / ${formatAmount(totalBasePoolDeposits)}`}
                  </Box>
                ) : (
                  formatAmount(totalBasePoolDeposits)
                )}
              </Typography>
              <Typography variant="h6" className="text-stieglitz">
                {asset.symbol}
              </Typography>
            </Box>
            <Box className="border-cod-gray rounded-xl border p-4 ml-2 text-center h-full flex flex-col justify-center bg-cod-gray">
              <Typography variant="h6">
                {userQuotePoolDeposits > 0 ? (
                  <Box>
                    <span className="text-wave-blue">
                      {formatAmount(userQuotePoolDeposits)}
                    </span>
                    {` / ${formatAmount(totalQuotePoolDeposits)}`}
                  </Box>
                ) : (
                  formatAmount(totalQuotePoolDeposits)
                )}
              </Typography>
              <Typography variant="h6" className="text-stieglitz">
                USDT
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className="flex w-full justify-between items-end mt-3 justify-self-end">
          <Typography variant="h6" className="text-stieglitz mb-1">
            Epoch {selectedEpoch}
          </Typography>
          <Box className="flex space-x-2">
            {rebateAmount !== '0' ? (
              <CustomButton size="small" onClick={claimRebate}>
                {formatAmount(claimableRebateAmount)} rDPX
              </CustomButton>
            ) : null}
            {rewardAmount !== '0' ? (
              <CustomButton size="small" onClick={claimReward}>
                {formatAmount(claimableRewardAmount)} DPX
              </CustomButton>
            ) : null}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default PoolCard;
