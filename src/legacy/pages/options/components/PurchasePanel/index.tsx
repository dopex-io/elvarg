import { forwardRef, useMemo, useContext, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import isEmpty from 'lodash/isEmpty';
import cx from 'classnames';
import Box from '@mui/material/Box';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import MuiInput from '@mui/material/Input';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import PnlChart from 'components/PnlChart';
import CustomButton from 'components/UI/CustomButton';
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

import { BASE_ASSET_MAP, DELEGATE_INFO } from 'constants/index';

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
    handleMargin,
    handleUseVolumePool,
    handleDelegate,
    userVolumePoolFunds,
    maxLeverage,
    marginAvailable,
    collaterals,
    handleCollateralIndex,
    handleLeverage,
    handleCollateralAmount,
    collateralValue,
    requiredCollateralValue,
  } = useOptionPurchase();

  const { baseAssetsWithPrices, usdtDecimals } = useContext(AssetsContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const finalCollateralValue = useMemo(
    () => getUserReadableAmount(collateralValue, usdtDecimals),
    [collateralValue, usdtDecimals]
  );
  const finalRequiredCollateralValue = useMemo(
    () => getUserReadableAmount(requiredCollateralValue, usdtDecimals),
    [requiredCollateralValue, usdtDecimals]
  );

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

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

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
              {marginAvailable && (
                <Box className="flex justify-between">
                  <Box className="flex space-x-2">
                    <Typography variant="h6" component="span">
                      Leverage up to {maxLeverage}x
                    </Typography>
                  </Box>
                  <Switch
                    checked={formik.values.margin ?? false}
                    onChange={handleMargin}
                  />
                </Box>
              )}
              {formik.values.margin && (
                <>
                  <Box className="flex justify-between">
                    <Button
                      className="bg-mineshaft text-white mr-1"
                      onClick={() => handleLeverage({ target: { value: 2 } })}
                    >
                      2x
                    </Button>
                    <Button
                      className="bg-mineshaft text-white mr-1"
                      onClick={() =>
                        handleLeverage({
                          target: { value: Number(maxLeverage) },
                        })
                      }
                    >
                      {maxLeverage}x
                    </Button>
                    <MuiInput
                      id="amount"
                      name="amount"
                      type="number"
                      disableUnderline={true}
                      value={formik.values.leverage.toString()}
                      onChange={handleLeverage}
                      className="h-10 w-full text-md text-white font-mono bg-mineshaft rounded-md p-1 px-2"
                    />
                  </Box>
                  <Box className="flex justify-between">
                    <CustomButton
                      size="medium"
                      color="mineshaft"
                      className="w-full uppercase"
                      aria-controls="expiry-menu"
                      aria-haspopup="true"
                      onClick={handleClick}
                      endIcon={<ExpandMoreIcon />}
                    >
                      {collaterals[formik.values.collateralIndex].symbol}
                    </CustomButton>
                    <Menu
                      id="expiry-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      classes={{ paper: 'bg-cod-gray' }}
                    >
                      {collaterals.map((collateral, index) => (
                        <MenuItem
                          key={collateral.token}
                          onClick={() => {
                            handleCollateralIndex(index);
                            handleClose();
                          }}
                          className="text-white uppercase"
                        >
                          {collateral.symbol}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                  <Box className="flex justify-between">
                    <Typography
                      variant="caption"
                      component="div"
                      className="text-stieglitz"
                    >
                      Balance
                    </Typography>
                    <Typography variant="caption" component="div">
                      {formatAmount(
                        getUserReadableAmount(
                          userAssetBalances[
                            collaterals[formik.values.collateralIndex].symbol
                          ],
                          collaterals[formik.values.collateralIndex].decimals
                        ).toString(),
                        3
                      )}{' '}
                      {collaterals[formik.values.collateralIndex].symbol}
                    </Typography>
                  </Box>
                  <Box className="flex justify-between">
                    <Typography
                      variant="caption"
                      component="div"
                      className="text-stieglitz"
                    >
                      Collateral Value
                    </Typography>
                    <Typography variant="caption" component="div">
                      {'$'}
                      {formatAmount(finalCollateralValue, 3)}
                    </Typography>
                  </Box>
                  <Box className="flex justify-between">
                    <Typography
                      variant="caption"
                      component="div"
                      className="text-stieglitz"
                    >
                      Minimum Collateral Value
                    </Typography>
                    <Typography variant="caption" component="div">
                      {'$'}
                      {formatAmount(finalRequiredCollateralValue, 3)}
                    </Typography>
                  </Box>
                  <Box className="flex justify-between">
                    <Typography
                      variant="caption"
                      component="div"
                      className="text-stieglitz"
                    >
                      Collateral Amount
                    </Typography>
                  </Box>
                  <Box className="flex justify-between">
                    <MuiInput
                      id="amount"
                      name="amount"
                      type="number"
                      disableUnderline={true}
                      classes={{ input: 'text-right' }}
                      value={formik.values.collateralAmount.toString()}
                      onChange={handleCollateralAmount}
                      className="h-10 w-full text-md text-white font-mono bg-mineshaft rounded-md p-1 px-3"
                    />
                  </Box>
                </>
              )}
              <Box className="flex justify-between">
                <Box className="flex space-x-2">
                  <Typography variant="h6" component="span">
                    Use Volume Pool Funds
                  </Typography>
                </Box>
                <Switch
                  checked={formik.values.useVolumePoolFunds ?? false}
                  onChange={handleUseVolumePool}
                />
              </Box>
              {!formik.values.margin && (
                <Box className="flex justify-between">
                  <Box className="flex space-x-2">
                    <Typography variant="h6" component="span">
                      Auto Exercise
                    </Typography>
                    <Tooltip title={DELEGATE_INFO} placement="bottom">
                      <InfoOutlinedIcon className="h-3 w-3 mt-1.5" />
                    </Tooltip>
                  </Box>
                  <Switch
                    checked={formik.values.delegate ?? false}
                    onChange={handleDelegate}
                  />
                </Box>
              )}
            </Box>
            {formik.values.margin && (
              <Box className="rounded-xl border border-umbra p-4 flex flex-col space-y-4">
                <Typography
                  variant="caption"
                  component="div"
                  className="text-stieglitz"
                >
                  This will lock {formik.values.collateralAmount.toString()}{' '}
                  {collaterals[formik.values.collateralIndex].symbol} as
                  collateral for your trade. Please maintain sufficient
                  collateral in order to avoid liquidation.
                </Typography>
              </Box>
            )}
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
            <WalletButton
              size="large"
              onClick={purchaseOptions}
              disabled={Boolean(formik.errors.amount)}
              fullWidth
            >
              {Boolean(formik.errors.amount) ? (
                String(formik.errors.amount)
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

PurchasePanel.displayName = 'PurchasePanel';

export default PurchasePanel;
