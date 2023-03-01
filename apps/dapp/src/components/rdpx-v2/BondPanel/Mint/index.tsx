import { useCallback, useState, useEffect } from 'react';
import { MockToken__factory, RdpxV2Treasury__factory } from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import Input from 'components/UI/Input';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import CollateralInputPanel from 'components/rdpx-v2/BondPanel/Mint/CollateralInputPanel';
import DisabledPanel from 'components/rdpx-v2/BondPanel/DisabledPanel';

import { useBoundStore } from 'store';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import { getContractReadableAmount } from 'utils/contracts';

import useSendTx from 'hooks/useSendTx';

import { MAX_VALUE, TOKEN_DECIMALS } from 'constants/index';

const Mint = () => {
  const {
    chainId,
    signer,
    provider,
    accountAddress,
    contractAddresses,
    userAssetBalances,
    treasuryContractState,
    treasuryData,
    userDscBondsData,
    isLoading,
  } = useBoundStore();

  const sendTx = useSendTx();

  const [value, setValue] = useState<number | string>('');
  const [approved, setApproved] = useState<boolean>(false);

  const handleChange = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) => {
      setValue(e.target.value);
    },
    []
  );

  // const handleMax = useCallback(() => {
  //   setValue(
  //     getUserReadableAmount(
  //       userAssetBalances['WETH'] ?? '0',
  //       getTokenDecimals('WETH', chainId)
  //     )
  //   );
  // }, [chainId, userAssetBalances]);

  const handleApprove = useCallback(async () => {
    if (
      !treasuryData ||
      !accountAddress ||
      !signer ||
      !treasuryContractState.contracts ||
      !contractAddresses
    )
      return;

    const treasury = treasuryContractState.contracts.treasury;

    const rdpx = MockToken__factory.connect(
      treasuryData.tokenA.address,
      signer
    );
    const weth = MockToken__factory.connect(
      treasuryData.tokenB.address,
      signer
    );

    try {
      await sendTx(weth, 'approve', [treasury.address, MAX_VALUE]);
      await sendTx(rdpx, 'approve', [treasury.address, MAX_VALUE]);

      setApproved(true);
    } catch (e) {
      console.log(e);
    }
  }, [
    treasuryData,
    accountAddress,
    signer,
    treasuryContractState.contracts,
    contractAddresses,
    sendTx,
  ]);

  const handleBond = useCallback(async () => {
    if (
      !treasuryContractState.contracts ||
      !accountAddress ||
      !contractAddresses ||
      !signer
    )
      return;

    const treasury = RdpxV2Treasury__factory.connect(
      contractAddresses['RDPX-V2']['Treasury'],
      signer
    );
    try {
      await sendTx(treasury, 'bond', [
        getContractReadableAmount(value, 18),
        accountAddress,
      ]);
    } catch (e) {
      console.log(e);
    }
  }, [
    accountAddress,
    contractAddresses,
    sendTx,
    signer,
    treasuryContractState.contracts,
    value,
  ]);

  useEffect(() => {
    (async () => {
      if (
        !treasuryContractState.contracts ||
        !provider ||
        !accountAddress ||
        !treasuryData.tokenA.address ||
        !treasuryData.tokenB.address
      )
        return;

      const _weth = MockToken__factory.connect(
        treasuryData.tokenA.address,
        provider
      );
      const _rdpx = MockToken__factory.connect(
        treasuryData.tokenB.address,
        provider
      );

      const allowances = await Promise.all([
        _weth.allowance(
          accountAddress,
          treasuryContractState.contracts.treasury.address
        ),
        _rdpx.allowance(
          accountAddress,
          treasuryContractState.contracts.treasury.address
        ),
      ]);

      const [rdpxReq, wethReq] = [
        treasuryData.bondCostPerDsc[0].mul(value || 1),
        treasuryData.bondCostPerDsc[1].mul(value || 1),
      ];

      setApproved(allowances[0].gte(wethReq) && allowances[1].gte(rdpxReq));
    })();
  }, [
    accountAddress,
    provider,
    treasuryContractState,
    treasuryData.bondCostPerDsc,
    treasuryData.tokenA,
    treasuryData.tokenA.address,
    treasuryData.tokenB,
    treasuryData.tokenB.address,
    value,
  ]);

  return (
    <Box className="space-y-3 relative">
      {!userDscBondsData.isEligibleForMint ? (
        <DisabledPanel isMint={true} />
      ) : null}
      <Box className="bg-umbra rounded-xl w-full h-fit">
        <Input
          type="number"
          size="small"
          value={value}
          onChange={handleChange}
          placeholder="0.0"
          leftElement={
            <Box className="flex my-auto space-x-2 w-2/3">
              <img
                src={`/images/tokens/${'DSC'?.toLowerCase()}.svg`}
                alt={'USDC'.toLowerCase()}
                className="w-[30px] h-[30px]"
              />
              {/* <Box
                className="rounded-md bg-mineshaft text-stieglitz hover:bg-mineshaft my-auto p-2"
                role="button"
                onClick={handleMax}
              >
                <Typography variant="caption" color="stieglitz">
                  MAX
                </Typography>
              </Box> */}
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
                userAssetBalances['WETH'] ?? '0',
                TOKEN_DECIMALS[chainId]?.['WETH']
              ),
              3,
              true
            )}{' '}
            {treasuryData.tokenA.symbol}
          </Typography>
        </Box>
      </Box>
      <CollateralInputPanel
        inputAmount={Number(value)}
        setApproved={setApproved}
      />
      <Box className="rounded-xl p-4 w-full bg-umbra">
        <Box className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800 space-y-2">
          <EstimatedGasCostButton gas={500000} chainId={chainId} />
        </Box>
        {userDscBondsData.isEligibleForMint || isLoading ? (
          <CustomButton
            size="medium"
            className="w-full mt-4 rounded-md"
            color={approved ? 'mineshaft' : 'primary'}
            disabled={!userDscBondsData.isEligibleForMint || isLoading}
            onClick={approved ? handleBond : handleApprove}
          >
            {approved ? 'Bond' : 'Approve'}
          </CustomButton>
        ) : (
          <a
            className="flex space-x-2 w-full mt-4 rounded-md bg-[#3966A0] justify-between p-2"
            role="link"
            href="https://arbitrum.curve.fi/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="flex space-x-2">
              <img
                src={'/images/tokens/crv.svg'}
                alt="crv"
                className="w-4 my-auto"
              />
              <Typography variant="h6">Buy DSC</Typography>
            </span>
            <LaunchOutlinedIcon className="fill-current text-white w-[1.1rem]" />
          </a>
        )}
      </Box>
    </Box>
  );
};

export default Mint;
