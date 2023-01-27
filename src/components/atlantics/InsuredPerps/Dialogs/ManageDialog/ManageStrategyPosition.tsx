import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import {
  GmxVault__factory,
  InsuredLongsStrategy__factory,
} from '@dopex-io/sdk';
import { BigNumber } from 'ethers';

import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';
import ContentRow from 'components/atlantics/InsuredPerps/ManageCard/ManagePosition/ContentRow';
import { ActionState } from 'components/atlantics/InsuredPerps/Tables/Positions';
import LiquidationProtectionIcon from 'svgs/icons/LiquidationProtection';

import { useBoundStore } from 'store';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import useSendTx from 'hooks/useSendTx';

import { MIN_EXECUTION_FEE } from 'constants/gmx';
import { MAX_VALUE } from 'constants/index';

const options: { [key: string]: string }[] = [
  {
    option: 'Exit Strategy + Long Position',
    description: `Exit long position and strategy, withdrawing remaining collateral from the position along with PnL. 
      Note that strategy positions with ITM put options and no deposited underlying can only choose to close.`,
  },
];

interface Props {
  strategyLabel?: string;
}

const ManageStrategyPositionDialog = (props: Props) => {
  const { strategyLabel = 'Insured Perps' } = props;

  const { signer, accountAddress, contractAddresses, atlanticPool } =
    useBoundStore();

  const sendTx = useSendTx();

  const [unwindApproved, setUnwindApproved] = useState(false);
  const [selectedOptionItem, _] = useState<number>(0);
  const [strategyDetails, setStrategyDetails] = useState({
    pnl: '0',
    putStrike: '0',
    optionsAmount: '0',
    UnderlyingDeposited: 'No',
    status: 'None',
    collateral: '0',
    positionId: BigNumber.from(0),
    atlanticsPurchaseId: BigNumber.from(0),
  });

  const updateStrategyPosition = useCallback(async () => {
    if (!contractAddresses || !accountAddress || !signer || !atlanticPool)
      return;

    const strategy = InsuredLongsStrategy__factory.connect(
      contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'],
      signer
    );
    const gmxVault = GmxVault__factory.connect(
      contractAddresses['GMX-VAULT'],
      signer
    );
    const atlanticPoolContract = atlanticPool.contracts.atlanticPool;

    const [userPositionManager, userStrategyId] = await Promise.all([
      strategy.userPositionManagers(accountAddress),
      strategy.userPositionIds(accountAddress),
    ]);

    const strategyPosition = await strategy.strategyPositions(userStrategyId);
    const [gmxPosition, atlanticsPosition, positionDelta] = await Promise.all([
      gmxVault.getPosition(
        userPositionManager,
        strategyPosition.indexToken,
        strategyPosition.indexToken,
        true
      ),
      atlanticPoolContract.getOptionsPurchase(
        strategyPosition.atlanticsPurchaseId
      ),
      gmxVault.getPositionDelta(
        userPositionManager,
        strategyPosition.indexToken,
        strategyPosition.indexToken,
        true
      ),
    ]);

    const [deltaInToken, collateral] = await Promise.all([
      gmxVault.usdToTokenMin(
        strategyPosition.collateralToken,
        positionDelta[1]
      ),
      gmxVault.usdToTokenMin(strategyPosition.collateralToken, gmxPosition[1]),
    ]);

    const state = ActionState[strategyPosition.state];

    if (!state) return;

    setStrategyDetails({
      pnl: formatAmount(
        positionDelta[0]
          ? getUserReadableAmount(deltaInToken, 6)
          : getUserReadableAmount(deltaInToken, 6) * -1,
        3
      ),
      putStrike: String(
        getUserReadableAmount(atlanticsPosition.optionStrike, 8)
      ),
      optionsAmount: formatAmount(
        getUserReadableAmount(atlanticsPosition.optionsAmount, 18),
        3
      ),
      UnderlyingDeposited: strategyPosition.keepCollateral ? 'Yes' : 'No',
      status: state,
      collateral: formatAmount(getUserReadableAmount(collateral, 6), 3),
      positionId: userStrategyId,
      atlanticsPurchaseId: strategyPosition.atlanticsPurchaseId,
    });
  }, [accountAddress, atlanticPool, contractAddresses, signer]);

  const checkApproved = useCallback(async () => {
    if (
      strategyDetails.positionId.isZero() ||
      !atlanticPool ||
      !accountAddress ||
      !contractAddresses
    )
      return;
    const allowance = await atlanticPool.contracts.baseToken.allowance(
      accountAddress,
      contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY']
    );

    let approvalAmount = BigNumber.from(0);
    if (strategyDetails.atlanticsPurchaseId.isZero()) {
      approvalAmount = BigNumber.from(MAX_VALUE);
    } else {
      const atlanticPoolContract = atlanticPool.contracts.atlanticPool;
      const { optionsAmount } = await atlanticPoolContract.getOptionsPurchase(
        strategyDetails.atlanticsPurchaseId
      );
      approvalAmount = approvalAmount.add(optionsAmount);
    }
    setUnwindApproved(() => approvalAmount.lte(allowance));
  }, [
    accountAddress,
    atlanticPool,
    contractAddresses,
    strategyDetails.atlanticsPurchaseId,
    strategyDetails.positionId,
  ]);

  const handleKeepCollateralApprove = useCallback(async () => {
    if (
      strategyDetails.positionId.isZero() ||
      !atlanticPool ||
      !accountAddress ||
      !contractAddresses ||
      !signer
    )
      return;

    // const approvalAmount =
    const options = await (
      await atlanticPool.contracts.atlanticPool.getOptionsPurchase(
        strategyDetails.atlanticsPurchaseId
      )
    ).optionsAmount;

    try {
      await sendTx(atlanticPool.contracts.baseToken, 'approve', [
        contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'],
        options,
      ]);
    } catch (e) {
      console.log(e);
    }
    checkApproved();
  }, [
    accountAddress,
    atlanticPool,
    contractAddresses,
    sendTx,
    signer,
    strategyDetails.atlanticsPurchaseId,
    strategyDetails.positionId,
    checkApproved,
  ]);

  const handleSubmit = useCallback(async () => {
    if (!accountAddress || !contractAddresses || !signer) return;
    const strategy = InsuredLongsStrategy__factory.connect(
      contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'],
      signer
    );

    const userPositionId = await strategy.userPositionIds(accountAddress);

    const overrides = {
      value: MIN_EXECUTION_FEE,
    };

    // @TODO To add token selector for this

    try {
      await sendTx(strategy, 'createExitStrategyOrder', [
        userPositionId,
        true,
        overrides,
      ]);
    } catch (e) {
      console.log(e);
    }
  }, [accountAddress, contractAddresses, sendTx, signer]);

  useEffect(() => {
    updateStrategyPosition();
  }, [updateStrategyPosition]);

  useEffect(() => {
    checkApproved();
  }, [checkApproved]);

  return (
    <Box className="w-full space-y-3 bg-umbra">
      <Box className="border border-carbon rounded-lg w-full divide-y divide-carbon">
        <Box className="flex divide-x divide-carbon">
          <Box className="space-y-1 w-1/2 text-start p-3">
            <LiquidationProtectionIcon className="w-5 h-5" />
            <Typography variant="h6">{strategyLabel}</Typography>
          </Box>
          <Box className="space-y-1 w-1/2 text-start p-3">
            <Typography variant="h6">
              {'$' + strategyDetails.putStrike}
            </Typography>
            <Typography variant="h6" color="stieglitz">
              Put Strike
            </Typography>
          </Box>
        </Box>
        <Box className="flex-col p-3 space-y-1">
          <ContentRow title="PnL" content={strategyDetails.pnl} highlightPnl />
          <ContentRow
            title="Collateral"
            content={'$' + strategyDetails.collateral}
          />
          <ContentRow
            title="Options Amount"
            content={strategyDetails.optionsAmount}
          />
          <ContentRow
            title="Underlying Deposited"
            content={strategyDetails.UnderlyingDeposited}
          />
          <ContentRow title="Status" content={strategyDetails.status} />
        </Box>
      </Box>
      {selectedOptionItem === 2 && !unwindApproved ? (
        <CustomButton onClick={handleKeepCollateralApprove} className="w-full">
          {' '}
          Approve WETH{' '}
        </CustomButton>
      ) : (
        options.map(({ option }, index) => (
          <CustomButton
            color="mineshaft"
            onClick={handleSubmit}
            key={index}
            className="w-full rounded-lg"
          >
            {option}
          </CustomButton>
        ))
      )}
    </Box>
  );
};

export default ManageStrategyPositionDialog;
