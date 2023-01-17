import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import { AtlanticPutsPool__factory, ERC20__factory } from '@dopex-io/sdk';
import { BigNumber } from 'ethers';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import Typography from 'components/UI/Typography';
import CustomInput from 'components/UI/CustomInput';
import MaxStrikeInput from 'components/atlantics/Manage/ManageCard/MaxStrikeInput';
import PoolStats from 'components/atlantics/Manage/ManageCard/PoolStats';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import CustomButton from 'components/UI/Button';
import Switch from 'components/UI/Switch';

import LockerIcon from 'svgs/icons/LockerIcon';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { MAX_VALUE, TOKEN_DECIMALS } from 'constants/index';

interface ManageCardProps {
  tokenId: string;
  underlying: string;
  poolType: string;
  duration: string;
}

const ManageCard = (props: ManageCardProps) => {
  const { underlying, poolType, duration } = props;

  const [value, setValue] = useState<number | string>('');
  const [maxStrike, setMaxStrike] = useState<number | string>('');
  const [maxApprove, setMaxApprove] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [currentPrice, setCurrentPrice] = useState<BigNumber>(
    BigNumber.from(0)
  );

  const sendTx = useSendTx();

  const {
    userAssetBalances,
    chainId,
    signer,
    contractAddresses,
    accountAddress,
    atlanticPool,
    updateAtlanticPoolEpochData,
    updateUserPositions,
    atlanticPoolEpochData,
  } = useBoundStore();

  const depositToken = useMemo(() => {
    if (!atlanticPool) {
      if (poolType == 'CALLS') {
        return 'WETH';
      } else {
        return 'USDC';
      }
    }
    const deposit = atlanticPool.tokens.depositToken;
    if (!deposit) return atlanticPool.tokens.underlying;
    return deposit;
  }, [atlanticPool, poolType]);

  const containerRef = React.useRef(null);

  // const disableButton = useMemo(() => {
  //   if (!atlanticPoolEpochData) return true;
  //   return !atlanticPoolEpochData.isVaultReady || !value || !maxStrike;
  // }, [value, maxStrike, atlanticPoolEpochData]);

  const handleChange = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) => {
      setValue(e.target.value);
    },
    []
  );

  const handleApprove = useCallback(async () => {
    if (!signer || !contractAddresses || !accountAddress || !depositToken)
      return;

    try {
      const token = ERC20__factory.connect(
        contractAddresses[depositToken],
        signer
      );
      await sendTx(
        token.approve(
          contractAddresses['ATLANTIC-POOLS'][underlying][poolType][duration],
          maxApprove
            ? MAX_VALUE.toString()
            : getContractReadableAmount(
                value,
                TOKEN_DECIMALS[chainId]?.[depositToken] ?? 18
              )
        )
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [
    accountAddress,
    chainId,
    contractAddresses,
    duration,
    poolType,
    signer,
    underlying,
    value,
    depositToken,
    maxApprove,
    sendTx,
  ]);

  const handleDeposit = useCallback(async () => {
    if (!signer || !accountAddress || !contractAddresses['ATLANTIC-POOLS'])
      return;

    let apContract;

    try {
      apContract = AtlanticPutsPool__factory.connect(
        contractAddresses['ATLANTIC-POOLS'][underlying][poolType][duration],
        signer
      );

      await sendTx(
        apContract
          .connect(signer)
          .deposit(
            getContractReadableAmount(maxStrike, 8),
            getContractReadableAmount(value, 6),
            accountAddress
          )
      ).then(() => {
        updateAtlanticPoolEpochData();
        updateUserPositions();
      });
    } catch (err) {
      console.log(err);
    }
  }, [
    signer,
    accountAddress,
    contractAddresses,
    underlying,
    poolType,
    duration,
    sendTx,
    maxStrike,
    value,
    updateAtlanticPoolEpochData,
    updateUserPositions,
  ]);

  const handleMax = useCallback(() => {
    if (!atlanticPool) return;
    const { depositToken } = atlanticPool?.tokens;
    if (!depositToken) return;
    setValue(
      getUserReadableAmount(
        userAssetBalances[depositToken || underlying] ?? '0',
        getTokenDecimals(depositToken, chainId)
      )
    );
  }, [chainId, atlanticPool, underlying, userAssetBalances]);

  const handleMaxApprove = useCallback(() => {
    setMaxApprove(!maxApprove);
  }, [maxApprove]);

  useEffect(() => {
    (async () => {
      if (
        !signer ||
        !contractAddresses ||
        !accountAddress ||
        !atlanticPool?.tokens ||
        !contractAddresses['ATLANTIC-POOLS']
      )
        return;
      const deposit = atlanticPool.tokens.depositToken;
      if (!deposit) return;
      if (!contractAddresses[deposit]) return;
      const token = ERC20__factory.connect(contractAddresses[deposit], signer);
      const allowance = await token.allowance(
        accountAddress,
        contractAddresses['ATLANTIC-POOLS'][underlying][poolType][duration]
      );
      setApproved(
        allowance.gte(
          getContractReadableAmount(
            value,
            TOKEN_DECIMALS[chainId]?.[deposit] ?? 18
          )
        )
      );
    })();
  }, [
    accountAddress,
    chainId,
    contractAddresses,
    duration,
    poolType,
    signer,
    underlying,
    value,
    atlanticPool?.tokens,
  ]);

  useEffect(() => {
    (async () => {
      if (!signer || !contractAddresses['ATLANTIC-POOLS']) return;

      let pool = AtlanticPutsPool__factory.connect(
        contractAddresses['ATLANTIC-POOLS'][underlying][poolType][duration],
        signer
      );

      setCurrentPrice(await pool.getUsdPrice());
    })();
  }, [contractAddresses, duration, poolType, atlanticPool, signer, underlying]);

  return (
    <Box
      className="flex flex-col bg-cod-gray rounded-2xl p-3 space-y-3 h-full"
      ref={containerRef}
    >
      <Box className="flex justify-between">
        <Typography variant="h5" className="my-auto">
          Deposit
        </Typography>
      </Box>
      <Box className="bg-umbra rounded-xl w-full">
        <CustomInput
          size="small"
          variant="outlined"
          outline="umbra"
          value={value}
          onChange={handleChange}
          leftElement={
            <Box className="flex h-full my-auto">
              <Box
                className="flex w-full mr-3 bg-cod-gray rounded-full space-x-1 p-1 pr-3"
                role="button"
              >
                <img
                  src={`/images/tokens/${depositToken?.toLowerCase()}.svg`}
                  alt={(depositToken || underlying).toLowerCase()}
                  className="w-[2.2rem]"
                />
                <Typography variant="h5" className="my-auto">
                  {depositToken}
                </Typography>
              </Box>
              <Box
                className="rounded-md bg-mineshaft text-stieglitz hover:bg-mineshaft my-auto p-2"
                role="button"
                onClick={handleMax}
              >
                <Typography variant="caption" color="stieglitz">
                  MAX
                </Typography>
              </Box>
            </Box>
          }
        />
        <Box className="flex justify-between px-3 pb-3">
          <Typography variant="h6" color="stieglitz">
            Balance
          </Typography>
          <Typography variant="h6">
            {formatAmount(
              getUserReadableAmount(
                userAssetBalances[depositToken] ?? '0',
                TOKEN_DECIMALS[chainId]?.[depositToken]
              ),
              3,
              true
            )}{' '}
            {depositToken}
          </Typography>
        </Box>
      </Box>
      <MaxStrikeInput
        token={depositToken}
        currentPrice={currentPrice}
        tickSize={atlanticPoolEpochData?.tickSize}
        maxStrikes={atlanticPoolEpochData?.maxStrikes}
        setMaxStrike={setMaxStrike}
      />
      <PoolStats poolType={poolType} />
      {!approved ? (
        <Box className="flex justify-between px-4">
          <Box className="flex space-x-1 my-auto">
            <Typography variant="h6" className="my-auto" color="stieglitz">
              Max Approve
            </Typography>
            <Tooltip
              title="You will not be prompted to approve your tokens again as you are providing full allowance to the contract. Use with caution!"
              enterTouchDelay={0}
              leaveTouchDelay={1000}
            >
              <InfoOutlinedIcon className="fill-current text-stieglitz p-0 w-4 h-4 my-auto" />
            </Tooltip>
          </Box>
          <Switch value={maxApprove} onChange={handleMaxApprove} />
        </Box>
      ) : null}
      <Box className="rounded-xl bg-umbra p-3 space-y-2">
        <Box className="rounded-md bg-carbon p-3">
          <EstimatedGasCostButton gas={500000} chainId={chainId} />
        </Box>
        <Box className="flex sm:justify-center lg:justify-start">
          <LockerIcon className="my-auto m-2 sm:w-5 lg:w-9 xl:w-5" />
          <Typography variant="h6" color="stieglitz">
            Withdrawals are locked until end of Epoch{' '}
            {atlanticPoolEpochData?.epoch.toString()}
          </Typography>
        </Box>
        <CustomButton
          className="flex w-full text-center"
          color="primary"
          // disabled={disableButton}
          onClick={approved ? handleDeposit : handleApprove}
        >
          {approved ? 'Deposit' : 'Approve'}
        </CustomButton>
      </Box>
    </Box>
  );
};

export default ManageCard;
