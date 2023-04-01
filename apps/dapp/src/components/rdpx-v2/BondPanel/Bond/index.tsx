import { useCallback, useEffect, useState } from 'react';

import {
  DPXVotingEscrow__factory,
  MockToken__factory,
  RdpxV2Treasury__factory,
} from '@dopex-io/sdk';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';
import { Switch } from '@dopex-io/ui';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';

import CustomButton from 'components/UI/Button';
import Input from 'components/UI/Input';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import CollateralInputPanel from 'components/rdpx-v2/BondPanel/Bond/CollateralInputPanel';
import DisabledPanel from 'components/rdpx-v2/BondPanel/DisabledPanel';

import { getContractReadableAmount } from 'utils/contracts';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { MAX_VALUE, TOKEN_DECIMALS } from 'constants/index';
import DelegatePanel from './DelegatePanel';

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
  const [delegate, setDelegate] = useState<Delegate>(DEFAULT_DELEGATE);

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
      if (!delegated)
        await sendTx(treasury, 'bond', [
          getContractReadableAmount(value, 18),
          accountAddress,
        ]).then(() => {
          updateUserDscBondsData();
          updateTreasuryData();
        });
      else {
        const availableDelegates = await getAvailableDelegatesFromTreasury();

        const wethPerDsc =
          treasuryData.bondCostPerDsc[1] || getContractReadableAmount(1, 18);

        const totalWethRequired = wethPerDsc
          .mul(getContractReadableAmount(value, 18))
          .div(getContractReadableAmount(1, 18));

        const { amounts, ids } = squeezeTreasuryDelegates(
          availableDelegates,
          totalWethRequired
        ) || { amounts: [], ids: [] };

        // console.log(
        //   'Squeeze amounts: ',
        //   amounts.map((amount) => getUserReadableAmount(amount, 18))
        // );
        // console.log(
        //   'Squeeze from IDs: ',
        //   ids.map((id) => id)
        // );

        await sendTx(treasury, 'bondWithDelegate', [
          accountAddress,
          amounts,
          ids,
        ]).then(() => {
          updateUserDscBondsData();
          updateTreasuryData();
        });
      }
    } catch (e) {
      console.log(e);
    }
  }, [
    treasuryContractState.contracts,
    accountAddress,
    contractAddresses,
    signer,
    sendTx,
    value,
    updateUserDscBondsData,
    updateTreasuryData,
    delegated,
    getAvailableDelegatesFromTreasury,
    squeezeTreasuryDelegates,
    treasuryData,
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

      setApproved(allowances[0].gte(rdpxReq) && allowances[1].gte(wethReq));
    })();
  }, [accountAddress, provider, treasuryContractState, treasuryData, value]);

  return (
    <div className="space-y-3 relative">
      {!userDscBondsData.isEligibleForMint || isLoading || mintDisabled ? (
        <DisabledPanel isMint={true} />
      ) : null}
      <div className="bg-umbra rounded-xl w-full h-fit">
        <Input
          type="number"
          size="small"
          value={value}
          onChange={handleChange}
          placeholder="0.0"
          leftElement={
            <div className="flex my-auto space-x-2 w-2/3">
              <img
                src={`/images/tokens/${'DSC'?.toLowerCase()}.svg`}
                alt={'USDC'.toLowerCase()}
                className="w-10 h-10 border border-mineshaft rounded-full"
              />
              {/* <div
                className="rounded-md bg-mineshaft text-stieglitz hover:bg-mineshaft my-auto p-2"
                role="button"
                onClick={handleMax}
              >
                <span className="text-xs text-stieglitz">
                  MAX
                </span>
              </div> */}
            </div>
          }
        />
        <div className="px-3 pb-3 space-y-1">
          <div className="flex justify-between">
            <span className="text-sm text-stieglitz">
              {treasuryData.tokenB.symbol} Balance
            </span>
            <span className="text-sm">
              {formatAmount(
                getUserReadableAmount(
                  userAssetBalances[treasuryData.tokenB.symbol.toUpperCase()] ??
                    '0',
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
                  userAssetBalances[treasuryData.tokenA.symbol.toUpperCase()] ??
                    '0',
                  TOKEN_DECIMALS[chainId]?.[
                    treasuryData.tokenA.symbol.toUpperCase()
                  ]
                ),
                3
              )}{' '}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-2 bg-umbra rounded-xl">
        <div className="flex justify-between px-2">
          <div>
            <span className="text-sm text-stieglitz">Delegate</span>
            <Tooltip
              title="Spend only rDPX by borrowing WETH and receiving 25% share of dpxWETH minus a small percentage in delegate fee."
              enterTouchDelay={0}
              leaveTouchDelay={1000}
            >
              <InfoOutlined className="fill-current text-stieglitz p-1" />
            </Tooltip>
          </div>
          <div className="my-auto">
            <Switch
              size="medium"
              checked={Boolean(delegated)}
              onChange={() => setDelegated(!delegated)}
              color="jaffa"
            />
          </div>
        </div>
        {delegated ? (
          <DelegatePanel delegate={delegate} setDelegate={setDelegate} />
        ) : null}
      </div>
      <CollateralInputPanel
        inputAmount={Number(value)}
        setApproved={setApproved}
      />
      <div className="rounded-xl p-4 w-full bg-umbra">
        <div className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800 space-y-2">
          <EstimatedGasCostButton gas={500000} chainId={chainId} />
        </div>
        {userDscBondsData.isEligibleForMint || isLoading ? (
          <CustomButton
            size="medium"
            className="w-full mt-4 rounded-md"
            color="primary"
            disabled={
              !userDscBondsData.isEligibleForMint || isLoading || delegated
            }
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
