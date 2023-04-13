import { useCallback, useEffect, useState, useMemo } from 'react';

import {
  DPXVotingEscrow__factory,
  MockToken__factory,
  RdpxV2Treasury__factory,
} from '@dopex-io/sdk';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';
import { Switch } from '@dopex-io/ui';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';

import CustomButton from 'components/UI/Button';
import Input from 'components/UI/Input';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import CollateralInputPanel from 'components/rdpx-v2/BondPanel/Bond/CollateralInputPanel';
import DisabledPanel from 'components/rdpx-v2/BondPanel/DisabledPanel';
import InfoBox from 'components/rdpx-v2/BondPanel/Bond/InfoBox';
import AlertIcon from 'svgs/icons/AlertIcon';
import Caution from 'svgs/icons/Caution';

import { BondingState } from 'store/RdpxV2/dpxeth-bonding';

import { getContractReadableAmount } from 'utils/contracts';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { MAX_VALUE, TOKEN_DECIMALS } from 'constants/index';

export type Delegate = {
  _id: number | string;
  delegate: string;
  amount: number | string;
  fee: number | string;
  activeCollateral: number | string;
};

export const DEFAULT_DELEGATE: Delegate = {
  _id: '',
  delegate: '',
  amount: '',
  fee: '',
  activeCollateral: '',
};

const Bond = () => {
  const {
    chainId,
    signer,
    provider,
    accountAddress,
    contractAddresses,
    updateAssetBalances,
    userAssetBalances,
    treasuryContractState,
    treasuryData,
    userDscBondsData,
    updateUserDscBondsData,
    updateTreasuryData,
    getAvailableDelegatesFromTreasury,
    squeezeTreasuryDelegates,
    isLoading,
  } = useBoundStore();

  const sendTx = useSendTx();

  const [value, setValue] = useState<number | string>('');
  const [approved, setApproved] = useState<boolean>(false);
  const [mintDisabled, setMintDisabled] = useState<boolean>(false);
  const [delegated, setDelegated] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleChange = useCallback(
    (e: { target: { value: React.SetStateAction<string | number> } }) => {
      setValue(Number(e.target.value) < 0 ? '' : e.target.value);
    },
    []
  );

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

    const weth = MockToken__factory.connect(
      treasuryData.tokenA.address,
      signer
    );

    const rdpx = MockToken__factory.connect(
      treasuryData.tokenB.address,
      signer
    );

    try {
      if (!delegated)
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
    delegated,
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
      if (!delegated)
        await sendTx(treasury, 'bond', [
          getContractReadableAmount(value, 18),
          accountAddress,
          0,
        ]).then(() => {
          updateAssetBalances().then(() =>
            updateTreasuryData().then(() => updateUserDscBondsData())
          );
        });
      else {
        const availableDelegates = await getAvailableDelegatesFromTreasury();

        const wethPerDsc =
          treasuryData.bondCostPerDsc[1] || getContractReadableAmount(1, 18);

        const totalWethRequired = wethPerDsc
          .mul(getContractReadableAmount(value, 18))
          .div(getContractReadableAmount(1, 18));

        let { amounts, ids } = squeezeTreasuryDelegates(
          availableDelegates,
          totalWethRequired,
          getContractReadableAmount(value, 18)
        ) || {
          amounts: [getContractReadableAmount(0, 18)],
          ids: [0],
        };

        await sendTx(treasury, 'bondWithDelegate', [
          accountAddress,
          amounts,
          ids,
          0,
        ]).then(() => {
          updateAssetBalances().then(() =>
            updateTreasuryData().then(() => updateUserDscBondsData())
          );
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [
    value,
    sendTx,
    treasuryContractState,
    accountAddress,
    contractAddresses,
    signer,
    delegated,
    updateUserDscBondsData,
    updateAssetBalances,
    getAvailableDelegatesFromTreasury,
    squeezeTreasuryDelegates,
    treasuryData,
    updateTreasuryData,
  ]);

  useEffect(() => {
    (async () => {
      if (
        !treasuryContractState.contracts ||
        !provider ||
        !accountAddress ||
        !treasuryData.tokenA.address ||
        !treasuryData.tokenB.address ||
        value === ''
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
        _rdpx.allowance(
          accountAddress,
          treasuryContractState.contracts.treasury.address
        ),
        _weth.allowance(
          accountAddress,
          treasuryContractState.contracts.treasury.address
        ),
      ]);

      const [rdpxReq, wethReq] = [
        treasuryData.bondCostPerDsc[0]
          .mul(getContractReadableAmount(value, 18))
          .div(getContractReadableAmount(1, 18)),
        treasuryData.bondCostPerDsc[1]
          .mul(getContractReadableAmount(value, 18))
          .div(getContractReadableAmount(1, 18)),
      ];

      const [upper, lower, second_lower] = [
        treasuryContractState.dsc_upper_peg,
        treasuryContractState.dsc_first_lower_depeg,
        treasuryContractState.dsc_second_lower_depeg,
      ];

      let eligibleUser = true;

      if (treasuryData.dscPrice.lt(second_lower)) {
        const veDpx = DPXVotingEscrow__factory.connect(
          '0x37b2786EAfD3EC4794A1863B4A11C0B7EA03F78b',
          provider
        );
        const userVeDpxBalance = await veDpx.balanceOf(accountAddress);
        eligibleUser = userVeDpxBalance.gte(
          getContractReadableAmount(1000, 18)
        );
      }

      setMintDisabled(
        treasuryData.dscPrice.gte(upper) ||
          treasuryData.dscPrice.lte(lower) ||
          !eligibleUser
      );

      setApproved(
        allowances[0].gte(rdpxReq.sub(1e4)) &&
          (allowances[1].gte(wethReq.sub(1e4)) || delegated) // **note**: account for dust
      );
    })();
  }, [
    accountAddress,
    provider,
    treasuryContractState,
    delegated,
    treasuryData,
    value,
  ]);

  useEffect(() => {
    if (!delegated) {
      setError('');
      return;
    }
    (async () => {
      if (
        !treasuryData ||
        !getAvailableDelegatesFromTreasury ||
        !squeezeTreasuryDelegates ||
        Number(value) === 0
      )
        return;

      const availableDelegates = await getAvailableDelegatesFromTreasury();

      const wethPerDsc =
        treasuryData.bondCostPerDsc[1] || getContractReadableAmount(1, 18);

      const totalWethRequired = wethPerDsc
        .mul(getContractReadableAmount(value, 18))
        .div(getContractReadableAmount(1, 18));

      let { wethAvailable } = squeezeTreasuryDelegates(
        availableDelegates,
        totalWethRequired,
        getContractReadableAmount(value, 18)
      ) || {
        amounts: [getContractReadableAmount(0, 18)],
        ids: [0],
        wethAvailable: '0',
      };

      if (totalWethRequired.gt(wethAvailable)) {
        setError('Insufficient WETH available from delegates.');
      } else {
        setError('');
      }
    })();
  }, [
    getAvailableDelegatesFromTreasury,
    squeezeTreasuryDelegates,
    treasuryData,
    value,
    delegated,
  ]);

  const handleMint = useCallback(async () => {
    console.log('Mint');
    if (
      !treasuryContractState.contracts ||
      !treasuryContractState.contracts.treasury ||
      !treasuryData ||
      !signer ||
      !accountAddress
    )
      return;

    const treasury = RdpxV2Treasury__factory.connect(
      contractAddresses['RDPX-V2']['Treasury'],
      signer
    );

    try {
      await sendTx(treasury, 'upperDepeg', [
        getContractReadableAmount(value, 18),
        accountAddress,
      ]).then(() => {
        updateTreasuryData();
      });
    } catch (e) {
      console.error(e);
    }
  }, [treasuryContractState.contracts, treasuryData, signer]);

  const handleRepeg = useCallback(async () => {
    console.log('Repeg');
    if (
      !treasuryContractState.contracts ||
      !treasuryContractState.contracts.treasury ||
      !treasuryData ||
      !signer ||
      !accountAddress
    )
      return;

    const treasury = RdpxV2Treasury__factory.connect(
      contractAddresses['RDPX-V2']['Treasury'],
      signer
    );

    try {
      await sendTx(treasury, 'firstLowerDepeg', [
        getContractReadableAmount(value, 18),
      ]).then(() => {
        updateTreasuryData();
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const buttonProps = useMemo(() => {
    if (userDscBondsData.state === BondingState.open) {
      return { action: handleBond, label: 'Bond', info: null };
    } else if (userDscBondsData.state === BondingState.upper) {
      return {
        action: handleMint,
        label: 'Mint',
        info: '$dpxETH price is above 1.01 WETH. 1:1 minting of WETH is now enabled.',
      };
    } else if (userDscBondsData.state === BondingState.first_lower) {
      return {
        action: handleRepeg,
        label: 'Mint',
        info: '$dpxETH price is below 0.99 WETH. Restore peg of dpxETH via the treasury.',
      };
    } else if (userDscBondsData.state === BondingState.second_lower) {
      return {
        action: handleBond, // **todo**: implement logic for treasury.secondLowerDepeg(uint256,address)
        label: 'Redeem',
        info: '$dpxETH price is below 0.985 WETH. Privileged users can now redeem RDPX/WETH LP for ETH at 1:1 ratio.',
      };
    }
    return { action: handleBond, label: 'Bond' };
  }, [userDscBondsData.state, value, delegated]);

  return (
    <div className="space-y-3 relative">
      {Number(userDscBondsData.state) !== BondingState.open ||
      isLoading ||
      mintDisabled ? (
        <DisabledPanel displayKey={accountAddress ? 'mint' : 'connect'} />
      ) : null}
      <div className="bg-umbra rounded-xl w-full h-fit divide-y-2 divide-cod-gray">
        <Input
          type="number"
          size="small"
          value={value}
          onChange={handleChange}
          placeholder="0.0"
          className="pb-2 px-2"
          leftElement={
            <div className="flex my-auto space-x-2 w-2/3">
              <img
                src={`/images/tokens/${'DSC'?.toLowerCase()}.svg`}
                alt={'USDC'.toLowerCase()}
                className="w-10 h-10 border border-mineshaft rounded-full"
              />
            </div>
          }
          bottomElement={
            <>
              <div className="flex justify-between">
                <span className="text-sm text-stieglitz">
                  {treasuryData.tokenB.symbol} Balance
                </span>
                <span className="text-sm">
                  {formatAmount(
                    getUserReadableAmount(
                      userAssetBalances[
                        treasuryData.tokenB.symbol.toUpperCase()
                      ] ?? '0',
                      TOKEN_DECIMALS[chainId]?.[
                        treasuryData.tokenB.symbol.toUpperCase()
                      ]
                    ),
                    3
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-stieglitz">
                  {treasuryData.tokenA.symbol.toUpperCase()} Balance
                </span>
                <span className="text-sm">
                  {formatAmount(
                    getUserReadableAmount(
                      userAssetBalances[
                        treasuryData.tokenA.symbol.toUpperCase()
                      ] ?? '0',
                      TOKEN_DECIMALS[chainId]?.[
                        treasuryData.tokenA.symbol.toUpperCase()
                      ]
                    ),
                    3
                  )}{' '}
                </span>
              </div>
            </>
          }
        />
        <div className="flex flex-col p-2 bg-umbra">
          <div className="flex justify-between h-fit">
            <div>
              <span className="text-sm text-stieglitz">Use Delegate</span>
              <Tooltip
                title="Spend only rDPX by using WETH from delegating users to cover 75% of the bonds and receive 25% share of dpxETH minus a small percentage in delegation fee."
                enterTouchDelay={0}
                leaveTouchDelay={1000}
              >
                <InfoOutlinedIcon className="fill-current text-stieglitz p-1" />
              </Tooltip>
            </div>
            <div className="pt-1">
              <Switch
                size="medium"
                checked={Boolean(delegated)}
                onChange={() => setDelegated(!delegated)}
                color="jaffa"
              />
            </div>
          </div>
        </div>
        <CollateralInputPanel
          inputAmount={Number(value)}
          setInputAmount={setValue}
          setApproved={setApproved}
          delegated={delegated}
        />
      </div>
      <InfoBox value={value as string} delegated={delegated} />
      {delegated && error ? (
        <div className="py-2 px-4 bg-down-bad rounded-xl flex justify-center space-x-2 animate-pulse">
          <AlertIcon className="my-auto w-6 h-6" />
          <p className="text-black text-sm">{error}</p>
        </div>
      ) : null}
      {buttonProps.info ? (
        <div className="p-1 bg-jaffa rounded-xl flex justify-center space-x-2 animate-pulse">
          <Caution className="my-auto" />
          <p className="text-black text-sm my-auto">{buttonProps.info}</p>
        </div>
      ) : null}
      <div className="rounded-xl p-4 w-full bg-umbra">
        <div className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800 space-y-2">
          <EstimatedGasCostButton gas={500000} chainId={chainId} />
        </div>
        {userDscBondsData.state === BondingState.open || isLoading ? (
          <CustomButton
            size="medium"
            className="w-full mt-4 rounded-md"
            color="primary"
            disabled={
              userDscBondsData.state !== BondingState.open ||
              isLoading ||
              !Number(value) ||
              Boolean(error)
            }
            onClick={approved ? buttonProps.action : handleApprove}
          >
            {approved ? buttonProps.label : 'Approve'}
          </CustomButton>
        ) : (
          <a
            className="flex space-x-2 w-full mt-4 rounded-md bg-[#3966A0] justify-between p-2"
            role="link"
            href="/rdpx-v2/curve-swap"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="flex space-x-2">
              <img
                src={'/images/tokens/crv.svg'}
                alt="crv"
                className="w-4 my-auto"
              />
              <span className="text-sm">Buy $dpxETH</span>
            </span>
            <LaunchOutlinedIcon className="fill-current text-white w-[1.1rem]" />
          </a>
        )}
      </div>
    </div>
  );
};

export default Bond;
