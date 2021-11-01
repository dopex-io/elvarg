import { forwardRef, useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import isEmpty from 'lodash/isEmpty';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Tooltip from '@material-ui/core/Tooltip';

import PnlChart from 'components/PnlChart';
import Typography from 'components/UI/Typography';
import Input from 'components/UI/Input';
import Accordion from 'components/UI/Accordion';
import Switch from 'components/UI/Switch';
import WalletButton from 'components/WalletButton';
import ErrorBox from 'components/ErrorBox';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import useOptionPurchase from 'hooks/useOptionPurchase';

import { AssetsContext } from 'contexts/Assets';

import {
  BASE_ASSET_MAP,
  DELEGATE_INFO,
  PRICE_INCREMENTS,
} from 'constants/index';

import styles from './styles.module.scss';

const PurchasePanel = forwardRef<HTMLDivElement>((_props, ref) => {
  const {
    txError,
    availableOptions,
    expiry,
    fees,
    formik,
    handleChange,
    isPut,
    purchaseOptions,
    selectedBaseAsset,
    selectedOptionData,
    totalPrice,
    userAssetBalances,
    handleUseVolumePool,
    handleDelegate,
    userVolumePoolFunds,
  } = useOptionPurchase();

  const { baseAssetsWithPrices } = useContext(AssetsContext);

  const { finalCost, finalTotalCost, finalFees } = useMemo(() => {
    const _totalPrice = getUserReadableAmount(totalPrice, 6);
    const _fees = getUserReadableAmount(fees, 8);

    return {
      finalCost: `$${formatAmount(_totalPrice, 3)}`,
      finalTotalCost: formik.values.useVolumePoolFunds
        ? `$${formatAmount(((_totalPrice + _fees) * 95) / 100, 3)}`
        : `$${formatAmount(_totalPrice + _fees, 3)}`,
      finalFees: `$${formatAmount(_fees, 3)}`,
    };
  }, [formik.values.useVolumePoolFunds, totalPrice, fees]);

  return (
    <div
      className={cx('bg-cod-gray p-4 rounded-xl mx-auto', styles.panelSize)}
      ref={ref}
    >
      {isEmpty(selectedOptionData) ? (
        <Box className="h-96 flex justify-center items-center">
          <Typography
            variant="h5"
            component="p"
            className="text-stieglitz p-5 text-center"
          >
            Your option buy details will be displayed here when you’ve selected
            one to the left.
          </Typography>
        </Box>
      ) : (
        <>
          <Box className="flex flex-col space-y-5 mb-2">
            <Box className="flex flex-row w-full items-center justify-between">
              <Typography variant="h5">Purchase Option</Typography>
              <Box className="flex flex-row">
                <Box
                  className={cx(
                    'bg-umbra uppercase py-1 px-2 flex space-x-2 items-center',
                    styles.optionTypeIndicator
                  )}
                >
                  <Box
                    className={cx(
                      isPut ? 'bg-down-bad' : 'bg-primary',
                      'w-1 h-1 rounded-full'
                    )}
                  />
                  <span className="text-xs">{isPut ? 'Put' : 'Call'}</span>
                </Box>
              </Box>
            </Box>
            <Box className="flex justify-between">
              <Typography
                variant="caption"
                className="text-stieglitz"
                component="div"
              >
                Available:{' '}
                <span className="text-white">
                  {formatAmount(
                    getUserReadableAmount(availableOptions.toString(), 18),
                    3
                  )}
                </span>
              </Typography>
              <Typography
                variant="caption"
                className="text-stieglitz"
                component="div"
              >
                Option Size
              </Typography>
            </Box>
          </Box>
          <Box className="flex flex-col space-y-4">
            <Box className="bg-umbra rounded-xl flex flex-col pb-4">
              <Input
                leftElement={
                  <Box
                    className={cx(
                      'bg-cod-gray p-2 rounded-xl flex space-x-2 items-center',
                      styles.iconContainerHeight
                    )}
                  >
                    <Box className="w-8">
                      <img
                        src={`/static/svg/tokens/${BASE_ASSET_MAP[selectedBaseAsset].symbol}.svg`}
                        alt={BASE_ASSET_MAP[selectedBaseAsset].symbol}
                      />
                    </Box>
                    <Box>{BASE_ASSET_MAP[selectedBaseAsset].symbol}</Box>
                  </Box>
                }
                id="amount"
                name="amount"
                type="number"
                value={formik.values.amount.toString()}
                onChange={handleChange}
                onBlur={formik.handleBlur}
              />
              <Box className="flex justify-between px-4 mb-4">
                <Typography
                  variant="caption"
                  component="div"
                  className="text-stieglitz"
                >
                  Fees
                </Typography>
                <Typography variant="caption" component="div">
                  {finalFees}
                </Typography>
              </Box>
              <Box className="flex justify-between px-4">
                <Typography
                  variant="caption"
                  component="div"
                  className="text-stieglitz"
                >
                  Cost
                </Typography>
                <Typography variant="caption" component="div">
                  {finalCost}
                </Typography>
              </Box>
            </Box>
            <ErrorBox error={formik.values.error || txError} />
            <Box className="bg-umbra rounded-xl p-4 flex flex-col space-y-4">
              <Box className="flex justify-between">
                <Typography
                  variant="caption"
                  component="div"
                  className="text-stieglitz"
                >
                  Strike Price
                </Typography>
                <Typography variant="caption" component="div">
                  ${formatAmount(selectedOptionData.strikePrice)}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography
                  variant="caption"
                  component="div"
                  className="text-stieglitz"
                >
                  Option Price
                </Typography>
                <Typography variant="caption" component="div">
                  ${formatAmount(selectedOptionData.optionPrice, 3)}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography
                  variant="caption"
                  component="div"
                  className="text-stieglitz"
                >
                  Expiry
                </Typography>
                <Typography variant="caption" component="div">
                  {format(expiry, 'EEE d LLLL')}
                </Typography>
              </Box>
            </Box>
            <Accordion
              summary="How to exercise"
              details="Buying this option will transfer option tokens to your wallet which can be used to exercised this option. Exercise can be done from the portfolio page."
              footer={<Link to="/portfolio">Go To Portfolio</Link>}
            />
            <Box className="bg-umbra rounded-xl p-4">
              <PnlChart
                breakEven={selectedOptionData.breakEven}
                price={getUserReadableAmount(
                  baseAssetsWithPrices[selectedBaseAsset].price,
                  8
                )}
                priceIncrement={PRICE_INCREMENTS[selectedBaseAsset].increment}
                symbol={baseAssetsWithPrices[selectedBaseAsset].symbol}
                optionPrice={selectedOptionData.optionPrice}
                isPut={isPut}
                amount={formik.values.amount}
              />
            </Box>
            <Box className="rounded-xl border border-umbra p-4 flex flex-col space-y-4">
              <Box className="flex justify-between">
                <Typography
                  variant="caption"
                  component="div"
                  className="text-stieglitz"
                >
                  Final Cost{' '}
                  {formik.values.useVolumePoolFunds ? '(With 5% Discount)' : ''}
                </Typography>
                <Typography
                  variant="caption"
                  component="div"
                  className="text-wave-blue"
                >
                  {finalTotalCost} <span className="opacity-60">USDT</span>
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography
                  variant="caption"
                  component="div"
                  className="text-stieglitz"
                >
                  {formik.values.useVolumePoolFunds ? 'Volume Pool ' : ''}
                  Balance
                </Typography>
                <Typography
                  variant="caption"
                  component="div"
                  className="text-wave-blue"
                >
                  $
                  {formatAmount(
                    getUserReadableAmount(
                      formik.values.useVolumePoolFunds
                        ? userVolumePoolFunds
                        : userAssetBalances.USDT,
                      6
                    ).toString(),
                    3
                  )}{' '}
                  <span className="opacity-60">USDT</span>
                </Typography>
              </Box>
            </Box>
            <Box className="flex space-x-2">
              <Switch
                checked={formik.values.useVolumePoolFunds ?? false}
                onChange={handleUseVolumePool}
              />
              <Typography variant="h6" component="span">
                Use Volume Pool Funds
              </Typography>
            </Box>
            <Box className="flex space-x-2">
              <Switch
                checked={formik.values.delegate ?? false}
                onChange={handleDelegate}
              />
              <Typography variant="h6" component="span">
                Auto Exercise
              </Typography>
              <Tooltip title={DELEGATE_INFO} placement="bottom">
                <InfoOutlinedIcon className="h-3 w-3 mt-1.5" />
              </Tooltip>
            </Box>
            <WalletButton
              size="large"
              onClick={purchaseOptions}
              disabled={Boolean(formik.errors.amount)}
              fullWidth
            >
              {Boolean(formik.errors.amount) ? (
                formik.errors.amount
              ) : (
                <>
                  {finalTotalCost}{' '}
                  {<span className="opacity-60 ml-1"> USDT</span>}
                </>
              )}
            </WalletButton>
          </Box>
        </>
      )}
    </div>
  );
});

export default PurchasePanel;
