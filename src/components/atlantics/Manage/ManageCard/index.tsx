import React, {
  useState,
  useCallback,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import Box from '@mui/material/Box';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  AtlanticPutsPool__factory,
  AtlanticCallsPool__factory,
  ERC20__factory,
} from '@dopex-io/sdk';

import Typography from 'components/UI/Typography';
import CustomInput from 'components/UI/CustomInput';
import TokenSelector from 'components/atlantics/TokenSelector';
import MaxStrikeInput from 'components/atlantics/Manage/ManageCard/MaxStrikeInput';
import PoolStats from 'components/atlantics/Manage/ManageCard/PoolStats';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import CustomButton from 'components/UI/CustomButton';

import LockerIcon from 'svgs/icons/LockerIcon';

import { AssetsContext } from 'contexts/Assets';
import { WalletContext } from 'contexts/Wallet';
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

  const { userAssetBalances } = useContext(AssetsContext);
  const { chainId, signer, contractAddresses, accountAddress } =
    useContext(WalletContext);
  const { selectedPool } = useContext(AtlanticsContext);

  const tx = useSendTx();

  const pool = useMemo(() => {
    if (!selectedPool) return;
    return selectedPool;
  }, [selectedPool]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number | string>('');
  const [maxStrike, setMaxStrike] = useState<number | string>('');
  const [selectedToken, setSelectedToken] = useState(
    pool?.tokens.deposit ?? 'T'
  );
  const [approved, setApproved] = useState<boolean>(false);

  const containerRef = React.useRef(null);

  const handleOpenSlider = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const handleChange = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) => {
      setValue(e.target.value);
    },
    []
  );

  const handleApprove = useCallback(async () => {
    if (!signer || !contractAddresses || !accountAddress) return;

    const token = ERC20__factory.connect(
      contractAddresses[selectedToken],
      signer
    );

    await token.approve(
      contractAddresses['ATLANTIC-POOLS'][underlying][poolType][duration],
      getContractReadableAmount(
        value,
        TOKEN_DECIMALS[chainId]?.[selectedToken] ?? 18
      )
    );
    setApproved(true);
  }, [
    accountAddress,
    chainId,
    contractAddresses,
    duration,
    poolType,
    selectedToken,
    signer,
    underlying,
    value,
  ]);

  const handleDeposit = useCallback(() => {
    if (!signer || !contractAddresses || !accountAddress) return;

    let apContract;
    if (selectedPool?.isPut) {
      apContract = AtlanticPutsPool__factory.connect(
        contractAddresses['ATLANTIC-POOLS'][underlying][poolType][duration],
        signer
      );
      tx(
        apContract
          .connect(signer)
          .deposit(
            Number(maxStrike) * 1e8,
            getContractReadableAmount(value, 6),
            accountAddress
          )
      );
    } else {
      apContract = AtlanticCallsPool__factory.connect(
        contractAddresses['ATLANTIC-POOLS'][underlying][poolType][duration],
        signer
      );
      tx(
        apContract
          .connect(signer)
          .deposit(getContractReadableAmount(value, 18), accountAddress)
      );
    }
  }, [
    signer,
    contractAddresses,
    accountAddress,
    selectedPool?.isPut,
    underlying,
    poolType,
    duration,
    tx,
    maxStrike,
    value,
  ]);

  const handleMax = useCallback(() => {
    setValue(
      getUserReadableAmount(
        userAssetBalances[selectedToken || underlying] ?? '0',
        getTokenDecimals(selectedToken, chainId)
      )
    );
  }, [chainId, selectedToken, underlying, userAssetBalances]);

  useEffect(() => {
    (async () => {
      if (!signer || !contractAddresses || !accountAddress) return;

      const token = ERC20__factory.connect(
        contractAddresses[selectedToken],
        signer
      );

      const allowance = await token.allowance(
        accountAddress,
        contractAddresses['ATLANTIC-POOLS'][underlying][poolType][duration]
      );

      setApproved(
        allowance.gte(
          getContractReadableAmount(
            value,
            TOKEN_DECIMALS[chainId]?.[selectedToken] ?? 18
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
    selectedToken,
    signer,
    underlying,
    value,
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
        {open && (
          <IconButton onClick={handleOpenSlider} className="p-0">
            <CloseRoundedIcon className="fill-current text-white" />
          </IconButton>
        )}
      </Box>
      {!open && (
        <>
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
                    className="flex w-full mr-3 bg-cod-gray rounded-full space-x-2 p-1"
                    role="button"
                    onClick={handleOpenSlider}
                  >
                    <img
                      src={`/images/tokens/${selectedToken.toLowerCase()}.svg`}
                      alt={(selectedToken || underlying).toLowerCase()}
                      className="w-[2.4rem]"
                    />
                    <Typography variant="h5" className="my-auto">
                      {selectedToken}
                    </Typography>
                    <ArrowDropDownRoundedIcon className="my-auto fill-current text-mineshaft" />
                  </Box>
                  <Button
                    className="rounded-lg bg-mineshaft text-stieglitz hover:bg-mineshaft my-auto"
                    onClick={handleMax}
                  >
                    <Typography variant="h6" className="text-stieglitz text-xs">
                      MAX
                    </Typography>
                  </Button>
                </Box>
              }
            />
          </Box>
          <MaxStrikeInput
            token={selectedToken}
            tickSize={pool?.config.tickSize}
            maxStrikes={pool?.strikes}
            setMaxStrike={setMaxStrike}
          />
          <PoolStats poolType={poolType} />
          <Box className="rounded-xl bg-umbra p-3 space-y-3">
            <Box className="rounded-md bg-carbon p-3">
              <EstimatedGasCostButton gas={500000} chainId={chainId} />
            </Box>
            <Box className="flex">
              <LockerIcon className="my-auto m-2" />
              <Typography variant="h6" className="text-stieglitz">
                Withdrawals are locked until end of Epoch{' '}
                <>{selectedPool?.state?.epoch.toString()}</>
              </Typography>
            </Box>
            <CustomButton
              className="flex w-full text-center"
              color={selectedPool?.state.isVaultReady ? 'primary' : 'mineshaft'}
              disabled={
                !selectedPool?.state.isVaultReady || !value || !maxStrike
              }
              onClick={approved ? handleDeposit : handleApprove}
            >
              {approved ? 'Deposit' : 'Approve'}
            </CustomButton>
          </Box>
        </>
      )}
      <TokenSelector
        open={open}
        setOpen={setOpen}
        tokens={[
          {
            symbol: pool?.tokens.deposit ?? '',
            address:
              pool?.contracts?.quoteToken.address ??
              '0x0000000000000000000000000000000000000000',
          },
        ]}
        setSelection={setSelectedToken}
        containerRef={containerRef}
      />
    </Box>
  );
};

export default ManageCard;
