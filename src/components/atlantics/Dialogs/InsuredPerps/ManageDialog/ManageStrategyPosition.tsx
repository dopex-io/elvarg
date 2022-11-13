import { Box } from '@mui/system';
import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import {
  GmxVault__factory,
  InsuredLongsStrategy__factory,
} from '@dopex-io/sdk';
import Tooltip from '@mui/material/Tooltip';

import CustomButton from 'components/UI/Button';
import ContentRow from 'components/atlantics/Dialogs/InsuredPerps/UseStrategy/StrategyDetails/ContentRow';
import { ActionState } from 'components/atlantics/Manage/Strategies/InsuredPerps/UserPositions';

import { useBoundStore } from 'store';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { MIN_EXECUTION_FEE } from 'constants/gmx';

import useSendTx from 'hooks/useSendTx';

const options: { [key: string]: string }[] = [
  {
    option: 'Exit Strategy & Long Position',
    description:
      'Exit long position and strategy, withdrawing remaining collateral from the position along with PnL. Note that strategy positions with ITM put options and no deposited underlying can only choose to close.',
  },
  {
    option: 'Exit Strategy & Keep Position',
    description:
      'Exit strategy but keep long position under your designated position manager contract, the same position can be re-insured in the future.',
  },
  {
    option: 'Enable unwind',
    description:
      'Deposit underlying to enable unwind to mitigate pre-liquidation price when your long position has unlocked collateral.',
  },
  {
    option: 'Unwind Underlying & Keep Long Position',
    description:
      "If underlying was deposited before using the strategy, you can use choose to keep borrowed collateral incase the put options bought for your long position's insurance are in the money.",
  },
  {
    option: 'Emergency Exit Strategy',
    description:
      'Immidiately exit strategy if position does not have borrowed collateral and exit options positions as well (Cannot be settled)',
  },
  {
    option: 'Insure Position',
    description:
      'Purchase options for your long position if you feel like it has been in a `Enable pending` state for too long.',
  },
];

const ManageStrategyPositionDialog = () => {
  const { signer, accountAddress, contractAddresses, atlanticPool } =
    useBoundStore();

  const sendTx = useSendTx();

  const [selectedOption, setSelectedOption] = useState<string>(
    'Exit Strategy & Long Position'
  );
  const [optionDescription, setOptionDescription] = useState(
    options[0]?.['description']
  );
  const [selectedOptionItem, setSelectedOptionItem] = useState<number>(0);
  const [strategyDetails, setStrategyDetails] = useState({
    pnl: '0',
    putStrike: '0',
    optionsAmount: '0',
    UnderlyingDeposited: 'No',
    status: 'None',
    collateral: '0',
  });

  const handleOptionSelectChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      setSelectedOption(e.target.value);
    },
    []
  );

  const handleOptioItemSelected = useCallback((index: number) => {
    setOptionDescription(options[index]?.['description']);
    setSelectedOptionItem(index);
  }, []);
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
    });
  }, [accountAddress, atlanticPool, contractAddresses, signer]);

  useEffect(() => {
    updateStrategyPosition();
  }, [updateStrategyPosition]);

  const handleSubmit = useCallback(async () => {
    if (!accountAddress || !contractAddresses || !signer) return;
    const strategy = InsuredLongsStrategy__factory.connect(
      contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'],
      signer
    );

    const userPositionId = await strategy.userPositionIds(accountAddress);
    const strategyPosition = await strategy.strategyPositions(userPositionId);

    let tx;
    const overrides = {
      value: MIN_EXECUTION_FEE,
    };

    if (selectedOptionItem === 0) {
      tx = strategy.createExitStrategyOrder(userPositionId, overrides);
    }
    if (selectedOptionItem === 1) {
      tx = strategy.createExitStrategyKeepLongPosition(
        userPositionId,
        overrides
      );
    }
    if (selectedOptionItem === 2) {
      tx = strategy.enableKeepCollateral(userPositionId);
    }
    if (selectedOptionItem === 3) {
      tx = strategy.createKeepCollateralOrder(userPositionId);
    }
    if (selectedOptionItem === 4) {
      tx = strategy.emergencyStrategyExit(userPositionId);
    }

    if (selectedOptionItem === 5) {
      tx = strategy.reuseStrategy(
        userPositionId,
        strategyPosition.expiry,
        strategyPosition.keepCollateral
      );
    }
    if (tx) {
      await sendTx(tx);
    }
  }, [accountAddress, contractAddresses, sendTx, signer, selectedOptionItem]);

  return (
    <Box className="w-full space-y-3">
      <Box className="bg-umbra w-full rounded-xl p-3">
        <ContentRow title="PnL" content={strategyDetails.pnl} />
        <ContentRow title="Collateral" content={strategyDetails.collateral} />
        <ContentRow title="Put Strike" content={strategyDetails.putStrike} />
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
      <Box className="flex flex-col items-center w-full space-y-3">
        <Select
          value={selectedOption}
          onChange={handleOptionSelectChange}
          className="bg-umbra rounded-md text-center font-semibold text-white w-full"
          MenuProps={{
            classes: { paper: 'bg-umbra' },
          }}
          classes={{ icon: 'text-white', select: 'px-3' }}
          placeholder={'Select Option'}
          variant="standard"
          disableUnderline
        >
          {options.map(({ option }, index) => (
            <MenuItem
              onClick={() => handleOptioItemSelected(index)}
              key={index}
              value={option}
            >
              <Typography variant="body1" className="my-auto text-white">
                {option}
              </Typography>
            </MenuItem>
          ))}
        </Select>
        <Tooltip
          title={optionDescription}
          placement="bottom"
          arrow
          enterTouchDelay={0}
          leaveTouchDelay={1000}
        >
          <CustomButton onClick={handleSubmit} className="w-full">
            Submit
          </CustomButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ManageStrategyPositionDialog;
