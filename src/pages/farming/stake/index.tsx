import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ERC20__factory, StakingRewards__factory } from '@dopex-io/sdk';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { BigNumber } from 'ethers';
import * as yup from 'yup';
import c from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import Input from 'components/UI/Input';
import CustomButton from 'components/UI/CustomButton';
import AppBar from 'components/AppBar';
import Typography from 'components/UI/Typography';
import MaxApprove from 'components/MaxApprove';
import LpTokenDistribution from '../components/LpTokenDistribution';

import Boosted from 'assets/farming/Boosted';
import Dropdown from 'assets/farming/Dropdown';
import Equal from 'assets/icons/Equal';
import dpxIcon from 'assets/tokens/dpx.svg';
import rdpxIcon from 'assets/tokens/rdpx.svg';
import dpxWethIcon from 'assets/tokens/dpx_weth.svg';
import rdpxWethIcon from 'assets/tokens/rdpx_weth.svg';

import { MAX_VALUE, UNISWAP_LINKS } from 'constants/index';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import { newEthersTransaction } from 'utils/contracts/transactions';

import { WalletContext } from 'contexts/Wallet';
import { FarmingContext } from 'contexts/Farming';

import styles from './styles.module.scss';

const Stake = () => {
  const [approved, setApproved] = useState(false);

  const [maxApprove, setMaxApprove] = useState(false);

  const { accountAddress, provider, signer, chainId } =
    useContext(WalletContext);

  const {
    DPX,
    DPX_WETH,
    rDPX_WETH,
    DPXPool,
    DPX_WETHPool,
    rDPX_WETHPool,
    RDPX,
    RDPXPool,
    isStake,
    token,
    setData,
    setStakingAsset,
    setPool,
  } = useContext(FarmingContext);

  const validationSchema = yup.object({
    amount: yup
      .number()
      .min(0, 'Amount has to be greater than 0')
      .required('Amount is required'),
  });

  const formik = useFormik({
    initialValues: {
      token: token ? token : 'DPX',
      amount: BigNumber.from(0),
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const { selectedToken, selectedPool } = useMemo(() => {
    if (formik.values.token === 'DPX') {
      return {
        selectedToken: DPX,
        selectedPool: DPXPool,
      };
    } else if (formik.values.token === 'DPX-WETH') {
      return {
        selectedToken: DPX_WETH,
        selectedPool: DPX_WETHPool,
      };
    } else if (formik.values.token === 'rDPX-WETH') {
      return {
        selectedToken: rDPX_WETH,
        selectedPool: rDPX_WETHPool,
      };
    } else if (formik.values.token === 'RDPX') {
      return {
        selectedToken: RDPX,
        selectedPool: RDPXPool,
      };
    }
  }, [
    formik.values.token,
    DPX,
    DPXPool,
    RDPX,
    RDPXPool,
    DPX_WETH,
    DPX_WETHPool,
    rDPX_WETH,
    rDPX_WETHPool,
  ]);

  const userBalance = useMemo(() => {
    if (!selectedToken) return 0;
    return selectedToken.userAssetBalance;
  }, [selectedToken]);

  useEffect(() => {
    (async function () {
      await Promise.all([
        setPool('DPX'),
        setPool('RDPX'),
        setPool('DPX-WETH'),
        setPool('rDPX-WETH'),
      ]);
    })();
  }, [setPool]);

  useEffect(() => {
    (async function () {
      if (!accountAddress) return;
      await Promise.all([
        setStakingAsset('DPX'),
        setStakingAsset('RDPX'),
        setStakingAsset('DPX-WETH'),
        setStakingAsset('rDPX-WETH'),
      ]);
    })();
  }, [setStakingAsset, accountAddress]);

  useEffect(() => {
    if (
      !selectedToken.selectedBaseAssetContract ||
      !selectedToken.stakingRewardsContractAddress
    )
      return;
    (async function () {
      let allowance = await ERC20__factory.connect(
        selectedToken.selectedBaseAssetContract.address,
        provider
      ).allowance(accountAddress, selectedToken.stakingRewardsContractAddress);

      if (formik.values.amount.lte(allowance) && allowance.toString() !== '0') {
        setApproved(true);
      } else {
        setApproved(false);
      }
    })();
  }, [accountAddress, selectedToken, provider, formik.values.amount]);

  // function that handles token approval for staking
  const handleApprove = useCallback(async () => {
    try {
      await newEthersTransaction(
        ERC20__factory.connect(
          selectedToken.selectedBaseAssetContract.address,
          signer
        ).approve(
          selectedToken?.stakingRewardsContractAddress,
          maxApprove ? MAX_VALUE : formik.values.amount
        )
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [maxApprove, selectedToken, signer, formik.values.amount]);

  const handleDeposit = useCallback(async () => {
    try {
      await newEthersTransaction(
        StakingRewards__factory.connect(
          selectedToken.stakingRewardsContractAddress,
          signer
        ).stake(formik.values.amount)
      );

      setStakingAsset(selectedToken.selectedBaseAsset);

      formik.setValues({
        token: formik.values.token,
        amount: BigNumber.from(0),
      });
    } catch (err) {
      console.log(err);
    }
  }, [
    setStakingAsset,
    formik,
    selectedToken.selectedBaseAsset,
    selectedToken.stakingRewardsContractAddress,
    signer,
  ]);

  const handleWithdraw = useCallback(async () => {
    try {
      await newEthersTransaction(
        StakingRewards__factory.connect(
          selectedToken.stakingRewardsContractAddress,
          signer
        ).withdraw(formik.values.amount)
      );

      setStakingAsset(selectedToken.selectedBaseAsset);
      formik.setValues({
        token: formik.values.token,
        amount: BigNumber.from(0),
      });
      // updateAssetBalances();
    } catch (err) {
      console.log(err);
    }
  }, [
    selectedToken.selectedBaseAsset,
    selectedToken.stakingRewardsContractAddress,
    setStakingAsset,
    formik,
    signer,
  ]);

  const handleStake = useCallback(() => {
    setData(() => ({
      token: formik.values.token,
      isStake: true,
    }));
    formik.resetForm();
  }, [setData, formik]);

  const handleUnstake = useCallback(() => {
    setData(() => ({
      token: formik.values.token,
      isStake: false,
    }));
    formik.resetForm();
  }, [setData, formik]);

  const handleMax = useCallback(() => {
    if (isStake) {
      formik.setFieldValue('amount', userBalance);
    } else {
      formik.setFieldValue('amount', selectedToken.userStakedBalance);
    }
  }, [formik, userBalance, isStake, selectedToken.userStakedBalance]);

  const onStakingAssetChange = useCallback(
    (e) => {
      formik.setFieldValue('token', e.target.value);
      formik.setFieldValue('amount', BigNumber.from(0));
    },
    [formik]
  );

  const deposit = useMemo(() => {
    if (!selectedToken) return 0;
    if (selectedToken.userStakedBalance) {
      let result = isStake
        ? getUserReadableAmount(selectedToken?.userStakedBalance, 18) +
          Number(getUserReadableAmount(formik.values.amount, 18))
        : getUserReadableAmount(selectedToken?.userStakedBalance, 18) -
          Number(getUserReadableAmount(formik.values.amount, 18));

      return result;
    }
  }, [isStake, selectedToken, formik.values.amount]);

  const inputHandleChange = useCallback(
    (e) => {
      formik.setFieldValue(
        'amount',
        getContractReadableAmount(
          e.target.value,
          selectedToken.selectedBaseAssetDecimals
        )
      );
    },
    [formik, selectedToken.selectedBaseAssetDecimals]
  );

  return (
    <Box className="overflow-x-hidden bg-black h-screen">
      <AppBar active="farms" />
      <Box className={c('mx-auto my-40 px-2', styles.cardSize)}>
        <Box className="bg-cod-gray sm:px-5 px-2 py-5 rounded-xl">
          <Box className="flex flex-row mb-4 justify-between">
            <IconButton className="p-0 pr-3 pb-1">
              <Link to="/farms">
                <ArrowBackIcon className="text-stieglitz" />
              </Link>
            </IconButton>
            <Box className="flex flex-row w-full items-center justify-between">
              <Typography variant="h4" className="">
                {isStake ? 'Stake' : 'Unstake'}
              </Typography>
              <Box className="flex flex-row">
                <CustomButton
                  size="medium"
                  className={c(
                    isStake
                      ? 'mr-1'
                      : 'bg-umbra text-stieglitz hover:bg-umbra mr-1'
                  )}
                  onClick={handleStake}
                >
                  Stake
                </CustomButton>
                {selectedToken?.userStakedBalance?.gt(0) ? (
                  <CustomButton
                    size="medium"
                    className={c(
                      !isStake
                        ? 'mr-1'
                        : 'bg-umbra text-stieglitz hover:bg-umbra'
                    )}
                    onClick={handleUnstake}
                  >
                    Unstake
                  </CustomButton>
                ) : null}
              </Box>
            </Box>
          </Box>
          <Box className="flex justify-between">
            {isStake ? (
              <Typography variant="h6" className="text-stieglitz mb-2">
                Balance:{' '}
                {formatAmount(getUserReadableAmount(userBalance, 18), 2)}
              </Typography>
            ) : (
              <Box />
            )}
            <Typography
              variant="h6"
              className="text-wave-blue uppercase mb-2 mr-2"
              role="button"
              onClick={handleMax}
            >
              Max
            </Typography>
          </Box>
          <Input
            leftElement={
              <Select
                id="token"
                name="token"
                value={formik.values.token}
                onChange={onStakingAssetChange}
                className="w-72 h-12 bg-cod-gray rounded-xl p-2"
                IconComponent={Dropdown}
                variant="outlined"
                classes={{ icon: 'mt-3 mr-1', root: 'p-0' }}
                MenuProps={{ classes: { paper: 'bg-cod-gray' } }}
              >
                <MenuItem value="DPX">
                  <Box className="flex flex-row items-center">
                    <Box className="flex flex-row h-8 w-8 mr-2">
                      <img src={dpxIcon} alt="DPX" />
                    </Box>
                    <Typography
                      variant="h5"
                      className="text-white hover:text-stieglitz"
                    >
                      DPX
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="DPX-WETH">
                  <Box className="flex flex-row items-center">
                    <Box className="flex flex-row h-8 w-14 items-center">
                      <img src={dpxWethIcon} alt="DPX-WETH" />
                    </Box>
                    <Typography
                      variant="h5"
                      className="text-white hover:text-stieglitz"
                    >
                      DPX/WETH
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="rDPX-WETH">
                  <Box className="flex flex-row items-center">
                    <Box className="flex flex-row h-8 w-14 items-center">
                      <img src={rdpxWethIcon} alt="rDPX-WETH" />
                    </Box>
                    <Typography
                      variant="h5"
                      className="text-white hover:text-stieglitz"
                    >
                      rDPX/WETH
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="RDPX">
                  <Box className="flex flex-row items-center">
                    <Box className="flex flex-row h-8 w-14 items-center">
                      <img src={rdpxIcon} alt="rDPX" />
                    </Box>
                    <Typography
                      variant="h5"
                      className="text-white hover:text-stieglitz"
                    >
                      rDPX
                    </Typography>
                  </Box>
                </MenuItem>
              </Select>
            }
            id="amount"
            type="number"
            name="amount"
            value={getUserReadableAmount(
              formik.values.amount,
              selectedToken.selectedBaseAssetDecimals
            )}
            onBlur={formik.handleBlur}
            onChange={inputHandleChange}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            className="mb-4"
          />
          <FormHelperText className="text-right mt-1 mb-2 text-red-400">
            {formik.touched.amount && formik.errors.amount}
          </FormHelperText>
          {formik.values.token === 'RDPX' ? (
            <Box className="lg:w-96 border-umbra rounded-xl border p-4 flex flex-col mb-4">
              <Box className="mr-3">
                <Boosted />
              </Box>
              <Typography variant="h5">
                This yield program is currently incentivized with a 2x rewards
                boost till the 15th of November.
              </Typography>
            </Box>
          ) : null}
          <Box className="lg:w-96 border-umbra rounded-xl border p-4 flex flex-col mb-4">
            <Box className="flex flex-col mb-2">
              <Box className="flex flex-row mb-2">
                <Typography
                  variant="h4"
                  className={c(
                    formik.values.amount
                      ? isStake
                        ? 'text-wave-blue flex flex-row items-center mr-2'
                        : 'text-wave-blue flex flex-row items-center mr-2'
                      : 'mr-2'
                  )}
                >
                  <Equal
                    className={c(
                      formik.values.amount ? 'block mr-2' : 'hidden mr-2'
                    )}
                  />
                  {formatAmount(deposit, 2)} {selectedToken.selectedBaseAsset}
                </Typography>
                <Typography variant="h4" className="text-stieglitz">
                  $ {formatAmount(selectedPool.tokenPrice * deposit, 2)}
                </Typography>
              </Box>
              <Box className="w-full mb-2">
                <LpTokenDistribution
                  stakingAsset={selectedPool.stakingAsset}
                  value={deposit}
                  layout="row"
                />
                <Typography variant="h6">Your Deposit</Typography>
              </Box>
            </Box>
            <hr className="border-umbra my-4" />
            <Box className="flex flex-row justify-between">
              <Box className="flex flex-col">
                <Typography variant="h5">
                  {formatAmount(selectedPool.TVL)}
                </Typography>
                <Typography variant="h6">TVL</Typography>
              </Box>
              <Box className="flex flex-col">
                <Typography variant="h5">
                  {formatAmount(selectedPool.APR, 2)}%
                </Typography>
                <Typography variant="h6">APR</Typography>
              </Box>
            </Box>
          </Box>
          {selectedToken.selectedBaseAsset !== 'DPX' &&
          selectedToken.selectedBaseAsset !== 'RDPX' ? (
            <a
              href={UNISWAP_LINKS[selectedToken.selectedBaseAsset]}
              target="_blank"
              rel="noreferrer noopener"
              className="text-white hover:text-wave-blue mb-5 block pl-1"
            >
              Add Liquidity <OpenInNewIcon className="text-sm mb-1" />
            </a>
          ) : null}
          <Box>
            {isStake ? (
              formik.values.amount.lte(0) ? (
                <CustomButton size="large" className="w-full" disabled>
                  Enter an amount
                </CustomButton>
              ) : approved ? (
                <Box className="flex flex-row">
                  <CustomButton
                    size="large"
                    className="w-full"
                    onClick={handleDeposit}
                    disabled={chainId === 1 ? true : false}
                  >
                    Deposit
                  </CustomButton>
                </Box>
              ) : (
                <Box className="flex flex-col">
                  <MaxApprove value={maxApprove} setValue={setMaxApprove} />
                  <Box className="flex flex-row mt-2 space-x-2">
                    <CustomButton
                      size="large"
                      onClick={handleApprove}
                      fullWidth
                      disabled={chainId === 1 ? true : false}
                    >
                      Approve
                    </CustomButton>
                    <CustomButton size="large" disabled fullWidth>
                      Deposit
                    </CustomButton>
                  </Box>
                </Box>
              )
            ) : (
              <CustomButton
                size="large"
                className="w-full"
                onClick={handleWithdraw}
                {...(formik.values.amount.gte(0)
                  ? { disabled: false }
                  : { disabled: true })}
              >
                Unstake
              </CustomButton>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Stake;
