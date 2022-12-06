import { useCallback, useRef, useMemo, useState, useEffect } from 'react';
import {
  DopexPositionManager__factory,
  ERC20__factory,
  GmxVault__factory,
  InsuredLongsStrategy__factory,
  InsuredLongsUtils__factory,
} from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { BigNumber } from 'ethers';

import CustomInput from 'components/UI/CustomInput';
import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';
import TokenSelector from 'components/atlantics/TokenSelector';
import ContentRow from 'components/atlantics/Dialogs/InsuredPerps/UseStrategy/StrategyDetails/ContentRow';

import { useBoundStore } from 'store';

import getTokenDecimals from 'utils/general/getTokenDecimals';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

import { TOKEN_DECIMALS } from 'constants/index';
import { MIN_EXECUTION_FEE } from 'constants/gmx';

import useSendTx from 'hooks/useSendTx';

const ManagePosition = () => {
  const {
    signer,
    accountAddress,
    contractAddresses,
    chainId,
    atlanticPool,
    userAssetBalances,
  } = useBoundStore();

  const sendTx = useSendTx();

  const [openTokenSelector, setOpenTokenSelector] = useState<boolean>(false);
  const [positionBalance, setPositionBalance] = useState<string>('0');
  const [action, setAction] = useState<string | number>('Increase');
  const [max, setMax] = useState<boolean>(false);

  const [selectedToken, setSelectedToken] = useState('USDC');
  const [outputToken, setOutputToken] = useState('USDC');

  const [increaseApproved, setIncreaseApproved] = useState(false);

  const [positionData, setPositionData] = useState({
    maxIncreasable: BigNumber.from(0),
    indexToken: '-',
    collateral: '-',
    entryPrice: '0',
    funding: {
      fee: '0',
      interval: '0',
    },
    leverage: '0',
    liquidationPrice: '0',
    positionManager: '-',
    insuranceStatus: 'None',
    size: BigNumber.from(0),
  });

  const containerRef = useRef(null);

  const handlePositionBalanceChange = (event: any) => {
    const { value } = event.target;
    setPositionBalance(value);
  };

  const handleMax = useCallback(async () => {
    const positionBalanceFiltered = String(
      parseFloat(positionData.collateral.replace(/,/g, ''))
    );
    if (action === 'Decrease') {
      setPositionBalance(() => positionBalanceFiltered);
      setMax(true);
    } else {
      if (!accountAddress || !selectedToken || !chainId) return;
      setPositionBalance(() =>
        String(
          getUserReadableAmount(
            positionData.maxIncreasable,
            getTokenDecimals(selectedToken, chainId)
          )
        )
      );
    }
  }, [
    accountAddress,
    action,
    chainId,
    positionData.maxIncreasable,
    selectedToken,
    positionData.collateral,
  ]);

  const allowedTokens = useMemo(() => {
    if (
      !atlanticPool ||
      !atlanticPool.tokens ||
      !contractAddresses ||
      !atlanticPool.tokens
    )
      return [];
    const { underlying, depositToken } = atlanticPool?.tokens;
    if (!underlying || !depositToken) return [];

    return [
      {
        symbol: underlying,
        address: contractAddresses[underlying],
      },
      {
        symbol: depositToken,
        address: contractAddresses[depositToken],
      },
    ];
  }, [atlanticPool, contractAddresses]);

  const selectToken = (token: string) => {
    setSelectedToken(() => token);
  };

  const updateGmxPosition = useCallback(async () => {
    if (
      !signer ||
      !contractAddresses ||
      !accountAddress ||
      !atlanticPool ||
      !atlanticPool.tokens ||
      !contractAddresses['GMX-VAULT']
    )
      return;

    const gmxVault = await GmxVault__factory.connect(
      contractAddresses['GMX-VAULT'],
      signer
    );
    const strategy = await InsuredLongsStrategy__factory.connect(
      contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'],
      signer
    );
    const utils = await InsuredLongsUtils__factory.connect(
      contractAddresses['STRATEGIES']['INSURED-PERPS']['UTILS'],
      signer
    );

    const { underlying, depositToken } = atlanticPool?.tokens;

    const indexTokenAddress = contractAddresses[underlying];
    const collateralTokenAddress = contractAddresses[depositToken];

    const [positionManager, positionId] = await Promise.all([
      strategy.userPositionManagers(accountAddress),
      strategy.userPositionIds(accountAddress),
    ]);

    const [leverage, gmxPosition, strategyPosition] = await Promise.all([
      gmxVault.getPositionLeverage(
        positionManager,
        indexTokenAddress,
        indexTokenAddress,
        true
      ),
      gmxVault.getPosition(
        positionManager,
        indexTokenAddress,
        indexTokenAddress,
        true
      ),
      strategy.strategyPositions(positionId),
    ]);

    if (gmxPosition[0].isZero()) return;

    const [
      collateral,
      cummulativeFunding,
      fundingRatePrecision,
      fundingInterval,
      positionFee,
    ] = await Promise.all([
      gmxVault.usdToTokenMin(collateralTokenAddress, gmxPosition[1]),
      gmxVault.cumulativeFundingRates(indexTokenAddress),
      gmxVault.FUNDING_RATE_PRECISION(),
      gmxVault.fundingInterval(),
      utils.getPositionFee(gmxPosition[0]),
    ]);

    const fundingRate = cummulativeFunding.sub(gmxPosition[3]);
    let fundingFee = gmxPosition[0].mul(fundingRate).div(fundingRatePrecision);
    fundingFee = await gmxVault.usdToTokenMin(
      collateralTokenAddress,
      fundingFee
    );
    const liquidationPrice = formatAmount(
      getUserReadableAmount(
        positionFee.add(
          gmxPosition[2].sub(gmxPosition[2].mul(1e4).div(leverage))
        ),
        30
      ),
      3
    );

    const maxIncreasable = await gmxVault.usdToTokenMin(
      contractAddresses[selectedToken],
      gmxPosition[0].sub(gmxPosition[1])
    );

    const interval = Number(fundingInterval) / 3600;

    setPositionData({
      size: gmxPosition[0],
      maxIncreasable,
      indexToken: underlying,
      collateral: formatAmount(getUserReadableAmount(collateral, 6), 3),
      entryPrice: formatAmount(getUserReadableAmount(gmxPosition[2], 30), 2),
      funding: {
        fee: formatAmount(getUserReadableAmount(fundingFee, 6), 3),
        interval: `${interval} Hours`,
      },
      leverage: formatAmount(getUserReadableAmount(leverage, 4), 2),
      liquidationPrice,
      positionManager,
      insuranceStatus:
        Number(strategyPosition.state) === 1 ? 'Inactive' : 'Active',
    });

    // setPositionBalance(formatAmount(getUserReadableAmount(collateral, 6), 3));
  }, [accountAddress, atlanticPool, contractAddresses, signer, selectedToken]);

  const handleSubmit = useCallback(async () => {
    if (
      !contractAddresses ||
      !accountAddress ||
      !signer ||
      !selectedToken ||
      !outputToken
    )
      return;

    const strategy = InsuredLongsStrategy__factory.connect(
      contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'],
      signer
    );

    const [positionManager, positionId] = await Promise.all([
      strategy.userPositionManagers(accountAddress),
      strategy.userPositionIds(accountAddress),
    ]);
    const strategyPosition = await strategy.strategyPositions(positionId);
    const positionManagerContract = DopexPositionManager__factory.connect(
      positionManager,
      signer
    );

    const gmxVault = GmxVault__factory.connect(
      contractAddresses['GMX-VAULT'],
      signer
    );

    let path: any[];

    let [minPrice, maxPrice] = await Promise.all([
      gmxVault.getMinPrice(strategyPosition.indexToken),
      gmxVault.getMaxPrice(strategyPosition.indexToken),
    ]);

    const precision = 100000;
    const slippage = 300;
    minPrice = minPrice.mul(precision - slippage).div(precision);
    maxPrice = maxPrice.mul(precision + slippage).div(precision);

    console.log('minPrice 2', minPrice.toString());
    const increaseOrderParams = {
      path: [strategyPosition.indexToken],
      indexToken: strategyPosition.indexToken,
      collateralDelta: BigNumber.from(0),
      positionSizeDelta: '0',
      // @ts-ignore
      acceptablePrice: action === 'Decrease' ? minPrice : maxPrice,
      isLong: true,
    };

    const selectedTokenAddress = contractAddresses[selectedToken];
    if (action === 'Increase') {
      path = [selectedTokenAddress, strategyPosition.indexToken];

      if (selectedTokenAddress == strategyPosition.indexToken) {
        path = [strategyPosition.indexToken];
      }

      increaseOrderParams.path = path;

      increaseOrderParams.collateralDelta = getContractReadableAmount(
        positionBalance,
        getTokenDecimals(selectedToken, chainId)
      );

      const tx = positionManagerContract.increaseOrder(increaseOrderParams, {
        value: MIN_EXECUTION_FEE,
      });

      await sendTx(tx);
    }

    if (action === 'Decrease') {
      const outputTokenAddress = contractAddresses[outputToken];
      path = [strategyPosition.indexToken];
      if (outputTokenAddress != strategyPosition.indexToken) {
        path = [strategyPosition.indexToken, outputTokenAddress];
      }
      increaseOrderParams.collateralDelta = await gmxVault.tokenToUsdMin(
        outputTokenAddress,
        getContractReadableAmount(
          positionBalance,
          getTokenDecimals(outputToken, chainId)
        )
      );

      if (max) {
        increaseOrderParams.collateralDelta = BigNumber.from(0);
        increaseOrderParams.positionSizeDelta = positionData.size.toString();
      }

      const decreaseOrderParams = {
        orderParams: increaseOrderParams,
        receiver: accountAddress,
        withdrawETH: false,
      };

      const tx = positionManagerContract.decreaseOrder(decreaseOrderParams, {
        value: MIN_EXECUTION_FEE,
      });

      await sendTx(tx);
    }
  }, [
    accountAddress,
    action,
    chainId,
    positionBalance,
    outputToken,
    contractAddresses,
    positionData.size,
    signer,
    selectedToken,
    max,
    sendTx,
  ]);

  useEffect(() => {
    updateGmxPosition();
  }, [updateGmxPosition]);

  const handleActionChange = useCallback(
    (e: { target: { value: string | number } }) => {
      const selectedAction = String(e.target.value);
      setAction(String(e.target.value));
      if (selectedAction === 'Decrease') {
        setSelectedToken(outputToken);
        setIncreaseApproved(() => true);
      }
    },
    [outputToken]
  );

  const handleOutputTokenSelection = useCallback(
    (e: { target: { value: string | number } }) => {
      setOutputToken(String(e.target.value));
    },
    []
  );

  const handleApprove = useCallback(async () => {
    if (!selectedToken || !contractAddresses || !signer) return;
    const token = ERC20__factory.connect(
      contractAddresses[selectedToken],
      signer
    );
    const tx = token.approve(
      positionData.positionManager,
      getContractReadableAmount(
        positionBalance,
        getTokenDecimals(selectedToken, chainId)
      )
    );

    await sendTx(tx);
  }, [
    chainId,
    contractAddresses,
    selectedToken,
    sendTx,
    signer,
    positionBalance,
    positionData.positionManager,
  ]);

  const checkTokenApprove = useCallback(async () => {
    if (!selectedToken || !contractAddresses || !signer || !accountAddress)
      return;
    if (action === 'Increase') {
      const token = ERC20__factory.connect(
        contractAddresses[selectedToken],
        signer
      );
      const allowance = await token.allowance(
        accountAddress,
        positionData.positionManager
      );
      const positioBalanceBigNumber = getContractReadableAmount(
        positionBalance,
        getTokenDecimals(selectedToken, chainId)
      );
      setIncreaseApproved(() => allowance.gte(positioBalanceBigNumber));
    } else {
      setIncreaseApproved(() => true);
    }
  }, [
    accountAddress,
    selectedToken,
    contractAddresses,
    signer,
    chainId,
    positionBalance,
    action,
    positionData.positionManager,
  ]);

  useEffect(() => {
    checkTokenApprove();
  }, [checkTokenApprove, action]);

  return (
    <Box className="space-y-4">
      <Box className="bg-umbra rounded-xl mb-2" ref={containerRef}>
        <CustomInput
          size="medium"
          variant="outlined"
          outline="umbra"
          value={positionBalance}
          onChange={handlePositionBalanceChange}
          leftElement={
            <Box className="flex my-auto">
              {action == 'Increase' && (
                <Box
                  className="flex w-full mr-3 bg-cod-gray rounded-full space-x-2 p-1 pr-1"
                  role="button"
                  onClick={() => setOpenTokenSelector(() => true)}
                >
                  <img
                    src={`/images/tokens/${selectedToken.toLowerCase()}.svg`}
                    alt={selectedToken}
                    className="w-[2rem]"
                  />
                  <Typography variant="h6" className="my-auto">
                    {selectedToken}
                  </Typography>
                  <KeyboardArrowDownRoundedIcon className="fill-current text-mineshaft my-auto" />
                </Box>
              )}

              <Button
                size="small"
                className="rounded-lg bg-mineshaft text-stieglitz hover:bg-mineshaft my-auto"
                onClick={handleMax}
              >
                <Typography
                  variant="caption"
                  className="text-xs"
                  color="stieglitz"
                >
                  MAX
                </Typography>
              </Button>
            </Box>
          }
        />
        {action === 'Increase' && (
          <TokenSelector
            setSelection={selectToken}
            open={openTokenSelector}
            setOpen={setOpenTokenSelector}
            tokens={allowedTokens}
            containerRef={containerRef}
          />
        )}
        <Box className="flex bg-umbra rounded-b-xl justify-between px-3 pb-3">
          <Typography variant="h6" color="stieglitz">
            Balance
          </Typography>
          <Typography variant="h6">
            {action === 'Increase'
              ? formatAmount(
                  getUserReadableAmount(
                    userAssetBalances[selectedToken] ?? '0',
                    TOKEN_DECIMALS[chainId]?.[selectedToken]
                  ),
                  3,
                  true
                )
              : positionData.collateral}{' '}
            {selectedToken}
          </Typography>
        </Box>
      </Box>
      <Box className="border border-neutral-800 mt-2 bg-umbra w-full p-4 rounded-xl">
        <Typography variant="h6" className="mb-2">
          Futures Position Details
        </Typography>
        <ContentRow title="Index token" content={positionData.indexToken} />
        <ContentRow title="Collateral" content={positionData.collateral} />
        <ContentRow title="Leverage" content={`${positionData.leverage}x`} />
        <ContentRow
          title="Liq. Price"
          content={positionData.liquidationPrice}
        />
        <ContentRow
          title="Insurance Status"
          content={positionData.insuranceStatus}
        />
        <ContentRow
          title="Funding"
          content={`${[positionData.funding.fee]} / ${
            positionData.funding.interval
          }`}
        />
      </Box>
      <Box className="flex justify-between items-center space-x-2">
        <Select
          value={action}
          onChange={handleActionChange}
          className="bg-umbra rounded-md w-full text-center font-semibold text-white"
          MenuProps={{
            classes: { paper: 'bg-umbra' },
          }}
          classes={{ icon: 'text-white', select: 'px-3' }}
          placeholder={'Select output token'}
          variant="standard"
          disableUnderline
        >
          <MenuItem value={'Increase'}>
            <Typography variant="h6">{'Increase'}</Typography>
          </MenuItem>
          <MenuItem value={'Decrease'}>
            <Typography variant="h6">{'Decrease'}</Typography>
          </MenuItem>
        </Select>
        {action === 'Decrease' && (
          <Select
            value={outputToken}
            onChange={handleOutputTokenSelection}
            className="bg-umbra rounded-md text-center font-semibold w-1/2 text-white"
            MenuProps={{
              classes: { paper: 'bg-umbra' },
            }}
            classes={{ icon: 'text-white', select: 'px-3' }}
            placeholder={'Select output token'}
            variant="standard"
            disableUnderline
          >
            {allowedTokens.map(({ symbol }, index) => (
              <MenuItem key={index} value={symbol}>
                <Typography variant="h6" className="my-auto">
                  Receive {symbol}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        )}
      </Box>
      {increaseApproved ? (
        <CustomButton onClick={handleSubmit} className="w-full">
          Submit
        </CustomButton>
      ) : (
        <CustomButton onClick={handleApprove} className="w-full">
          Approve {selectedToken}
        </CustomButton>
      )}
    </Box>
  );
};

export default ManagePosition;
