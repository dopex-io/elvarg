import { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber } from 'ethers';
import {
  DopexPositionManager__factory,
  GmxVault__factory,
  InsuredLongsStrategy__factory,
  InsuredLongsUtils__factory,
} from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';

import ManageModal from 'components/atlantics/InsuredPerps/Dialogs/ManageDialog';
import ContentRow from 'components/atlantics/InsuredPerps/ManageCard/ManagePosition/ContentRow';
import {
  TableBodyCell,
  TableHeader,
} from 'components/atlantics/Manage/UserDepositsTable';
import SignerButton from 'components/common/SignerButton';
import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import { MIN_EXECUTION_FEE } from 'constants/gmx';

interface IUserPositionData {
  underlying: string;
  delta: string | number | BigNumber;
  markPrice: string | BigNumber;
  entryPrice: string | BigNumber;
  liquidationPrice: string | BigNumber;
  leverage: string | BigNumber;
  putStrike: string | BigNumber;
  state: string | undefined;
  collateral: string | BigNumber;
  initialCollateral: string | BigNumber;
  size: string | BigNumber;
  depositUnderlying: boolean;
  type: 'Long';
}

export const ActionState: { [key: string]: string } = {
  '0': 'None', // 0
  '1': 'Settled', // 1
  '2': 'Active', // 2
  '3': 'Increase Pending', // 3
  '4': 'Increased', // 5
  '5': 'Enable Pending', // 7
  '6': 'Exit Pending', // 8
};

const Positions = ({
  active,
  setTriggerMarker,
}: {
  active: string;
  setTriggerMarker: Function;
}) => {
  const {
    signer,
    accountAddress,
    contractAddresses,
    atlanticPool,
    atlanticPoolEpochData,
  } = useBoundStore();

  const sendTx = useSendTx();

  const [openManageModal, setOpenManageModal] = useState<boolean>(false);
  const [onOpenSection, setOnOpenSection] = useState<string>('MANAGE_STRATEGY');

  const [, setIsPositionReleased] = useState(false);
  const [action, setAction] = useState<string | number>('Enable');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenManageModal = (section: string) => {
    setOnOpenSection(() => section);
    setOpenManageModal(() => true);
  };

  const [userPositionData, setUserPositionData] = useState<IUserPositionData>({
    underlying: '',
    delta: '0',
    markPrice: '0',
    entryPrice: '0',
    liquidationPrice: '0',
    leverage: '0',
    putStrike: '0',
    state: 'Loading',
    collateral: '0',
    initialCollateral: '0',
    size: '0',
    depositUnderlying: false,
    type: 'Long',
  });

  const getUserPositions = useCallback(async () => {
    if (!contractAddresses || !accountAddress || !atlanticPool || !signer)
      return;

    const strategyContractAddress: string =
      contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'];

    const strategyUtilsAddress: string =
      contractAddresses['STRATEGIES']['INSURED-PERPS']['UTILS'];
    const gmxVaultAddress: string = contractAddresses['GMX-VAULT'];
    const { underlying } = atlanticPool.tokens;

    if (!underlying) return;

    const underlyingAddress = contractAddresses[underlying];
    const strategyContract = InsuredLongsStrategy__factory.connect(
      strategyContractAddress,
      signer
    );
    const gmxVault = GmxVault__factory.connect(gmxVaultAddress, signer);
    const strategyUtils = InsuredLongsUtils__factory.connect(
      strategyUtilsAddress,
      signer
    );

    if (!gmxVault || !strategyContract || !strategyUtils) return;

    const [positionId, positionManager] = await Promise.all([
      strategyContract.userPositionIds(accountAddress),
      strategyContract.userPositionManagers(accountAddress),
    ]);
    const strategyPosition = await strategyContract.strategyPositions(
      positionId
    );

    const gmxPosition = await gmxVault.getPosition(
      positionManager,
      underlyingAddress,
      underlyingAddress,
      true
    );

    let atlanticsPosition: any,
      positionDelta: [boolean, BigNumber] = [false, BigNumber.from(0)],
      liquidationPrice = BigNumber.from(0),
      markPrice = BigNumber.from(0),
      hasProfit = false,
      position: IUserPositionData = {
        underlying,
        entryPrice: BigNumber.from(0),
        markPrice: BigNumber.from(0),
        leverage: BigNumber.from(0),
        putStrike: BigNumber.from(0),
        delta: BigNumber.from(0),
        liquidationPrice: BigNumber.from(0),
        state: 'Loading',
        collateral: BigNumber.from(0),
        initialCollateral: BigNumber.from(0),
        size: BigNumber.from(0),
        depositUnderlying: false,
        type: 'Long',
      };

    if (!gmxPosition[0].isZero()) {
      [atlanticsPosition, positionDelta, liquidationPrice, markPrice] =
        await Promise.all([
          atlanticPool.contracts.atlanticPool.getOptionsPurchase(
            strategyPosition.atlanticsPurchaseId
          ),
          gmxVault.getPositionDelta(
            positionManager,
            underlyingAddress,
            underlyingAddress,
            true
          ),
          strategyUtils['getLiquidationPrice(address,address)'](
            positionManager,
            underlyingAddress
          ),
          strategyUtils.getPrice(underlyingAddress),
        ]);

      const positionSize = gmxPosition[0];
      const collateral = gmxPosition[1];
      const collateralAccess = atlanticsPosition.optionStrike.mul(
        atlanticsPosition.optionsAmount.mul(10000)
      );
      hasProfit = positionDelta[0];

      position = {
        underlying,
        entryPrice: gmxPosition[2],
        markPrice: markPrice,
        leverage: positionSize.div(collateral.sub(collateralAccess)),
        putStrike: atlanticsPosition.optionStrike,
        delta: hasProfit ? positionDelta[1] : -positionDelta[1],
        liquidationPrice: liquidationPrice,
        state: ActionState[String(strategyPosition.state)],
        collateral: gmxPosition[1],
        size: positionSize,
        initialCollateral: collateral.sub(collateralAccess),
        depositUnderlying: strategyPosition.keepCollateral,
        type: 'Long',
      };
    } else {
      position.state = 'None';
    }

    setUserPositionData(() => position);
    setTriggerMarker(() =>
      getUserReadableAmount(position.putStrike, 8).toString()
    );
    setIsPositionReleased(() => strategyPosition.state === 1);
  }, [
    contractAddresses,
    signer,
    accountAddress,
    atlanticPool,
    setTriggerMarker,
  ]);

  const handleManageButtonClick = useCallback(() => {
    if (userPositionData.state === 'Settled') {
      handleOpenManageModal('MANAGE_POSITION');
      setOpenManageModal(true);
    } else {
      handleOpenManageModal('MANAGE_STRATEGY');
      setOpenManageModal(true);
    }
  }, [setOpenManageModal, userPositionData.state]);

  const handleUseStrategy = useCallback(() => {
    setOnOpenSection(() => 'USE_STRATEGY');
    setOpenManageModal(true);
  }, []);
  const handleManageStrategy = useCallback(() => {
    setOnOpenSection(() => 'MANAGE_STRATEGY');
    setOpenManageModal(true);
  }, []);
  const handleManagePosition = useCallback(() => {
    setOnOpenSection(() => 'MANAGE_POSITION');
    setOpenManageModal(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClose = useCallback(() => {
    setOpenManageModal(false);
  }, []);

  const handleEmergencyExit = useCallback(async () => {
    if (
      !contractAddresses ||
      !accountAddress ||
      !atlanticPool ||
      !signer ||
      !atlanticPoolEpochData
    )
      return;

    const strategyContractAddress: string =
      contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'];

    const strategyContract = InsuredLongsStrategy__factory.connect(
      strategyContractAddress,
      signer
    );

    const [positionId] = await Promise.all([
      strategyContract.userPositionIds(accountAddress),
      strategyContract.userPositionManagers(accountAddress),
    ]);

    await sendTx(strategyContract, 'emergencyStrategyExit', [positionId]).then(
      () => {
        getUserPositions();
      }
    );
  }, [
    accountAddress,
    atlanticPool,
    atlanticPoolEpochData,
    contractAddresses,
    getUserPositions,
    sendTx,
    signer,
  ]);

  const handleActionChange = useCallback(
    (e: { target: { value: string | number } }) => {
      setAction(String(e.target.value));
    },
    []
  );

  const handleExitLongPosition = useCallback(async () => {
    if (
      !contractAddresses ||
      !accountAddress ||
      !atlanticPool ||
      !signer ||
      !atlanticPool ||
      !atlanticPool.tokens
    )
      return;

    const strategyContractAddress: string =
      contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'];

    const gmxVaultAddress: string = contractAddresses['GMX-VAULT'];

    const gmxVault = GmxVault__factory.connect(gmxVaultAddress, signer);

    const strategyContract = InsuredLongsStrategy__factory.connect(
      strategyContractAddress,
      signer
    );

    const indexToken = await strategyContract.strategyIndexToken();

    const [userPositionManager, minPrice] = await Promise.all([
      strategyContract.userPositionManagers(accountAddress),
      gmxVault.getMinPrice(indexToken),
    ]);

    const toTokenAddress = contractAddresses[atlanticPool.tokens.depositToken];

    const gmxPosition = await gmxVault.getPosition(
      userPositionManager,
      indexToken,
      indexToken,
      true
    );

    const increaseOrderParams = {
      path: [indexToken, toTokenAddress],
      indexToken: indexToken,
      collateralDelta: 0,
      positionSizeDelta: gmxPosition[0],
      acceptablePrice: minPrice.mul(995).div(1000),
      isLong: true,
    };

    const decreaseOrder = {
      orderParams: increaseOrderParams,
      receiver: accountAddress,
      withdrawETH: false,
    };

    const userPositionManagerContract = DopexPositionManager__factory.connect(
      userPositionManager,
      signer
    );

    await sendTx(userPositionManagerContract, 'decreaseOrder', [
      decreaseOrder,
      { value: MIN_EXECUTION_FEE },
    ]).then(() => {
      getUserPositions();
    });
  }, [
    accountAddress,
    atlanticPool,
    signer,
    contractAddresses,
    getUserPositions,
    sendTx,
  ]);

  const handleReuseStrategy = useCallback(async () => {
    if (
      !contractAddresses ||
      !accountAddress ||
      !atlanticPool ||
      !signer ||
      !atlanticPoolEpochData
    )
      return;

    const strategyContractAddress: string =
      contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'];

    const strategyContract = InsuredLongsStrategy__factory.connect(
      strategyContractAddress,
      signer
    );

    const expiry = atlanticPoolEpochData.expiry;

    const [positionId] = await Promise.all([
      strategyContract.userPositionIds(accountAddress),
    ]);

    await sendTx(strategyContract, 'reuseStrategy', [
      positionId,
      expiry,
      false,
    ]).then(() => {
      getUserPositions();
    });
  }, [
    accountAddress,
    atlanticPool,
    atlanticPoolEpochData,
    signer,
    getUserPositions,
    contractAddresses,
    sendTx,
  ]);

  const handleIncreaseManagedPosition = useCallback(async () => {
    if (
      !contractAddresses ||
      !accountAddress ||
      !atlanticPool ||
      !signer ||
      !atlanticPoolEpochData
    )
      return;

    const strategyContractAddress: string =
      contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'];

    const strategyContract = InsuredLongsStrategy__factory.connect(
      strategyContractAddress,
      signer
    );

    const [positionId] = await Promise.all([
      strategyContract.userPositionIds(accountAddress),
      strategyContract.userPositionManagers(accountAddress),
    ]);

    await sendTx(strategyContract, 'createIncreaseManagedPositionOrder', [
      positionId,
      { value: MIN_EXECUTION_FEE },
    ]).then(() => {
      getUserPositions();
    });
  }, [
    accountAddress,
    atlanticPool,
    atlanticPoolEpochData,
    signer,
    getUserPositions,
    contractAddresses,
    sendTx,
  ]);

  const pnlPercentage = useMemo(() => {
    return formatAmount(
      (Number(userPositionData.delta) / Number(userPositionData.collateral)) *
        100,
      2
    );
  }, [userPositionData]);

  const renderButton = useMemo(() => {
    if (userPositionData.state === ActionState['2'])
      return (
        <Select
          value={action}
          onChange={handleActionChange}
          className="bg-primary rounded-md w-full text-center text-white border border-umbra p-2"
          MenuProps={{
            classes: { paper: 'bg-primary' },
          }}
          classes={{ icon: 'text-white', select: 'p-0' }}
          variant="standard"
          disableUnderline
        >
          <MenuItem
            onClick={handleIncreaseManagedPosition}
            value={'Add collateral'}
            className="text-white"
          >
            <Typography variant="h6">Add Collateral</Typography>
          </MenuItem>
          <MenuItem
            className="text-white"
            onClick={handleEmergencyExit}
            value={'Exit Strategy'}
          >
            <Typography variant="h6">Exit strategy</Typography>
          </MenuItem>
        </Select>
      );
    else if (userPositionData.state === ActionState['4'])
      return (
        <CustomButton onClick={handleManageButtonClick}>
          Exit Position
        </CustomButton>
      );
    else if (userPositionData.state === ActionState['5'])
      return (
        <CustomButton onClick={handleReuseStrategy}>
          Re-use Strategy
        </CustomButton>
      );

    return <CustomButton disabled>...</CustomButton>;
  }, [
    handleIncreaseManagedPosition,
    handleManageButtonClick,
    handleReuseStrategy,
    userPositionData.state,
    action,
    handleActionChange,
    handleEmergencyExit,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      getUserPositions();
    }, 3000);
    return () => clearInterval(interval);
  }, [getUserPositions]);

  return active === 'Insured Positions' || active === 'Orders' ? (
    <>
      <ManageModal
        section={onOpenSection}
        open={openManageModal}
        handleClose={handleClose}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        classes={{ paper: 'bg-umbra' }}
      >
        <MenuItem
          key="transfer-options"
          onClick={handleUseStrategy}
          className="text-white"
        >
          Use Strategy
        </MenuItem>
        <MenuItem
          key="transfer-options"
          onClick={handleManagePosition}
          className="text-white"
        >
          Manage Position
        </MenuItem>
        <MenuItem
          key="transfer-options"
          onClick={handleManageStrategy}
          className="text-white"
        >
          Manage Strategy
        </MenuItem>
      </Menu>
      {userPositionData.state === 'Loading' ? (
        <Box className="w-full text-center bg-cod-gray rounded-xl py-8">
          {accountAddress ? (
            <CircularProgress />
          ) : (
            <SignerButton>Connect</SignerButton>
          )}
        </Box>
      ) : (
        <>
          {userPositionData.state === 'None' ? (
            <Box className="w-full text-center bg-cod-gray rounded-xl py-8">
              <Typography variant="h6">No Active Positions</Typography>
            </Box>
          ) : (
            <TableContainer className="rounded-xl bg-cod-gray max-h-80 w-full overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Position</TableHeader>
                    <TableHeader>Net Value</TableHeader>
                    <TableHeader>Size</TableHeader>
                    <TableHeader>Collateral</TableHeader>
                    <TableHeader>Mark Price</TableHeader>
                    <TableHeader>Entry Price</TableHeader>
                    <TableHeader>Liq. Price</TableHeader>
                    <TableHeader align="right">Action</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableBodyCell>
                      <Box className="flex flex-col">
                        <Typography variant="h6">
                          {userPositionData.underlying}
                        </Typography>
                        <Box className="flex space-x-1">
                          <Typography variant="caption">
                            {userPositionData.leverage.toString()}x
                          </Typography>
                          <Typography
                            variant="caption"
                            color={
                              userPositionData.type === 'Long'
                                ? 'up-only'
                                : 'down-bad'
                            }
                          >
                            {userPositionData.type}
                          </Typography>
                        </Box>
                      </Box>
                    </TableBodyCell>
                    <TableBodyCell>
                      <Tooltip
                        followCursor
                        arrow={true}
                        color="transparent"
                        title={
                          <Box className="flex flex-col p-2 bg-carbon rounded-lg border border-mineshaft w-[12rem] space-y-2 bg-opacity-50 backdrop-blur-md">
                            <ContentRow
                              title="Initial Collateral:"
                              content={`$${formatAmount(
                                getUserReadableAmount(
                                  userPositionData.initialCollateral,
                                  30
                                ),
                                2
                              )}`}
                              textSize="caption"
                            />
                            <ContentRow
                              title="Put Strike:"
                              content={`$${formatAmount(
                                getUserReadableAmount(
                                  userPositionData.putStrike,
                                  8
                                ),
                                3
                              )}`}
                              textSize="caption"
                            />
                            <ContentRow
                              title="PnL:"
                              content={`${formatAmount(
                                getUserReadableAmount(
                                  userPositionData.delta,
                                  30
                                ),
                                2
                              )}`}
                              textSize="caption"
                              highlightPnl
                            />
                            <ContentRow
                              title="Collateral:"
                              content={`$${formatAmount(
                                getUserReadableAmount(
                                  userPositionData.collateral,
                                  30
                                ),
                                2
                              )}`}
                              textSize="caption"
                            />
                            <ContentRow
                              title="Status:"
                              content={`
                                ${userPositionData.state}`}
                              textSize="caption"
                            />
                          </Box>
                        }
                      >
                        <span className="flex flex-col hover:cursor-help">
                          <Typography
                            variant="h6"
                            className="underline decoration-dashed"
                          >
                            $
                            {formatAmount(
                              getUserReadableAmount(
                                userPositionData.collateral,
                                30
                              ),
                              2
                            )}
                          </Typography>
                          <Typography
                            className={`${
                              Number(userPositionData.delta) > 0
                                ? 'text-up-only'
                                : 'text-down-bad'
                            }`}
                            variant="caption"
                          >
                            {`${formatAmount(
                              getUserReadableAmount(userPositionData.delta, 30),
                              2
                            )}(${pnlPercentage}%)`}
                          </Typography>
                        </span>
                      </Tooltip>
                    </TableBodyCell>
                    <TableBodyCell>
                      <Typography variant="h6">
                        $
                        {formatAmount(
                          getUserReadableAmount(userPositionData.size, 30),
                          2
                        )}
                      </Typography>
                    </TableBodyCell>
                    <TableBodyCell>
                      <Typography variant="h6">
                        $
                        {formatAmount(
                          getUserReadableAmount(
                            userPositionData.collateral,
                            30
                          ),
                          2
                        )}
                      </Typography>
                    </TableBodyCell>
                    <TableBodyCell>
                      <Typography variant="h6">
                        $
                        {formatAmount(
                          getUserReadableAmount(userPositionData.markPrice, 8),
                          2
                        )}
                      </Typography>
                    </TableBodyCell>
                    <TableBodyCell>
                      <Typography variant="h6">
                        $
                        {formatAmount(
                          getUserReadableAmount(
                            userPositionData.entryPrice,
                            30
                          ),
                          3
                        )}
                      </Typography>
                    </TableBodyCell>
                    <TableBodyCell>
                      <Typography variant="h6">
                        $
                        {formatAmount(
                          getUserReadableAmount(
                            userPositionData.liquidationPrice,
                            30
                          ),
                          2
                        )}
                      </Typography>
                    </TableBodyCell>
                    <TableBodyCell align="right">
                      {userPositionData.state === ActionState['5'] ||
                      userPositionData.state === ActionState['1'] ? (
                        <Select
                          value={action}
                          onChange={handleActionChange}
                          className="bg-primary rounded-md w-full text-center text-white border border-umbra p-2"
                          MenuProps={{
                            classes: { paper: 'bg-primary' },
                          }}
                          classes={{ icon: 'text-white', select: 'p-0' }}
                          placeholder={'Select output token'}
                          variant="standard"
                          disableUnderline
                        >
                          <MenuItem
                            onClick={handleReuseStrategy}
                            value={'Enable'}
                            className="text-white"
                          >
                            <Typography variant="h6">
                              Enable Strategy
                            </Typography>
                          </MenuItem>
                          <MenuItem
                            className="text-white"
                            onClick={
                              userPositionData.state === ActionState['1']
                                ? handleExitLongPosition
                                : handleEmergencyExit
                            }
                            value={'Close'}
                          >
                            <Typography variant="h6">Exit Position</Typography>
                          </MenuItem>
                        </Select>
                      ) : (
                        renderButton
                      )}
                    </TableBodyCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </>
  ) : null;
};

export default Positions;
