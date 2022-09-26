import React, {
  useState,
  useCallback,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  AtlanticPutsPool__factory,
  AtlanticCallsPool__factory,
  ERC20__factory,
} from '@dopex-io/sdk';
import { BigNumber } from 'ethers';

import Typography from 'components/UI/Typography';
import CustomInput from 'components/UI/CustomInput';
import MaxStrikeInput from 'components/atlantics/Manage/ManageCard/MaxStrikeInput';
import PoolStats from 'components/atlantics/Manage/ManageCard/PoolStats';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import CustomButton from 'components/UI/Button';
import { OpenPositionDialog } from './PositionManager/OpenPositionDialog';

import LockerIcon from 'svgs/icons/LockerIcon';

import { useBoundStore } from 'store';
import { AtlanticsContext } from 'contexts/Atlantics';

import useSendTx from 'hooks/useSendTx';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

import { TOKEN_DECIMALS } from 'constants/index';

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
  const [approved, setApproved] = useState<boolean>(false);
  const [currentPrice, setCurrentPrice] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [openPositionManager, setOpenPositionManager] =
    useState<boolean>(false);

  const sendTx = useSendTx();

  const {
    userAssetBalances,
    chainId,
    signer,
    contractAddresses,
    accountAddress,
  } = useBoundStore();
  const { selectedPool } = useContext(AtlanticsContext);

  const depositToken = useMemo(() => {
    if (!selectedPool) {
      if (poolType == 'CALLS') {
        return 'WETH';
      } else {
        return 'USDC';
      }
    }
    const { deposit } = selectedPool.tokens;
    if (!deposit) return selectedPool.asset;
    return deposit;
  }, [selectedPool, poolType]);

  const containerRef = React.useRef(null);

  const disableButton = useMemo(() => {
    if (poolType === 'CALLS') {
      return !selectedPool?.state.isVaultReady || !value;
    } else {
      return !selectedPool?.state.isVaultReady || !value || !maxStrike;
    }
  }, [poolType, , value, maxStrike, selectedPool?.state.isVaultReady]);

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
          getContractReadableAmount(
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
    sendTx,
  ]);

  const handleDeposit = useCallback(async () => {
    if (!signer || !accountAddress || !contractAddresses['ATLANTIC-POOLS'])
      return;

    let apContract;

    if (selectedPool?.isPut) {
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
        );
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        apContract = AtlanticCallsPool__factory.connect(
          contractAddresses['ATLANTIC-POOLS'][underlying][poolType][duration],
          signer
        );
        await sendTx(
          apContract
            .connect(signer)
            .deposit(getContractReadableAmount(value, 18), accountAddress)
        );
      } catch (err) {
        console.log(err);
      }
    }
  }, [
    signer,
    contractAddresses,
    accountAddress,
    selectedPool?.isPut,
    underlying,
    poolType,
    duration,
    sendTx,
    maxStrike,
    value,
  ]);

  const handleMax = useCallback(() => {
    const { deposit } = selectedPool.tokens;
    if (!deposit) return;
    setValue(
      getUserReadableAmount(
        userAssetBalances[deposit || underlying] ?? '0',
        getTokenDecimals(deposit, chainId)
      )
    );
  }, [chainId, selectedPool.tokens, underlying, userAssetBalances]);

  useEffect(() => {
    (async () => {
      if (
        !signer ||
        !contractAddresses ||
        !accountAddress ||
        !selectedPool.tokens ||
        !contractAddresses['ATLANTIC-POOLS']
      )
        return;
      const { deposit } = selectedPool.tokens;
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
    selectedPool.tokens,
  ]);

  const openPositionManagerModal = useCallback(() => {
    setOpenPositionManager(true);
  }, []);

  const closePositionManager = useCallback(() => {
    setOpenPositionManager(false);
  }, []);

  useEffect(() => {
    (async () => {
      if (!signer || !contractAddresses['ATLANTIC-POOLS']) return;

      let pool = selectedPool?.isPut
        ? AtlanticPutsPool__factory.connect(
            contractAddresses['ATLANTIC-POOLS'][underlying][poolType][duration],
            signer
          )
        : AtlanticCallsPool__factory.connect(
            contractAddresses['ATLANTIC-POOLS'][underlying][poolType][duration],
            signer
          );

      setCurrentPrice(await pool.getUsdPrice());
    })();
  }, [
    contractAddresses,
    duration,
    poolType,
    selectedPool?.isPut,
    signer,
    underlying,
  ]);

  return (
    <Box
      className="flex flex-col bg-cod-gray rounded-2xl p-3 space-y-3 h-full"
      ref={containerRef}
    >
      <Box className="flex justify-between">
        <Typography variant="h5" className="my-auto">
          Deposit
        </Typography>
        {poolType === 'PUTS' ? (
          <>
            <Typography
              onClick={openPositionManagerModal}
              variant="h6"
              className="text-gray-300 underline cursor-pointer"
            >
              Open a long position
            </Typography>

            <OpenPositionDialog
              isOpen={openPositionManager}
              handleClose={closePositionManager}
            />
          </>
        ) : null}
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
                className="flex w-full mr-3 bg-cod-gray rounded-full space-x-2 p-1 pr-3"
                role="button"
              >
                <img
                  src={`/images/tokens/${depositToken?.toLowerCase()}.svg`}
                  alt={(depositToken || underlying).toLowerCase()}
                  className="w-[2.4rem]"
                />
                <Typography variant="h5" className="my-auto">
                  {depositToken}
                </Typography>
              </Box>
              <Button
                className="rounded-lg bg-mineshaft text-stieglitz hover:bg-mineshaft my-auto"
                onClick={handleMax}
              >
                <Typography variant="h6" className="text-xs" color="stieglitz">
                  MAX
                </Typography>
              </Button>
            </Box>
          }
        />
      </Box>
      {selectedPool?.isPut && (
        <MaxStrikeInput
          token={depositToken}
          currentPrice={currentPrice}
          tickSize={selectedPool?.config.tickSize}
          maxStrikes={selectedPool?.strikes}
          setMaxStrike={setMaxStrike}
        />
      )}

      <PoolStats poolType={poolType} />
      <Box className="rounded-xl bg-umbra p-3 space-y-3">
        <Box className="rounded-md bg-carbon p-3">
          <EstimatedGasCostButton gas={500000} chainId={chainId} />
        </Box>
        <Box className="flex">
          <LockerIcon className="my-auto m-2" />
          <Typography variant="h6" color="stieglitz">
            Withdrawals are locked until end of Epoch{' '}
            <>{selectedPool?.state?.epoch.toString()}</>
          </Typography>
        </Box>
        <CustomButton
          className="flex w-full text-center"
          color="primary"
          disabled={disableButton}
          onClick={approved ? handleDeposit : handleApprove}
        >
          {approved ? 'Deposit' : 'Approve'}
        </CustomButton>
      </Box>
    </Box>
  );
};

export default ManageCard;
