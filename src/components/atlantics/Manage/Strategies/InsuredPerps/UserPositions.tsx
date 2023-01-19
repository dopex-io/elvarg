import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  GmxVault__factory,
  InsuredLongsStrategy__factory,
  InsuredLongsUtils__factory,
} from '@dopex-io/sdk';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/styles';

import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';
import WalletButton from 'components/common/WalletButton';
import {
  TableHeader,
  TableBodyCell,
} from 'components/atlantics/Manage/UserDepositsTable';
import ManageModal from 'components/atlantics/Dialogs/InsuredPerps/ManageDialog';
import ContentRow from 'components/atlantics/InsuredPerps/ManagePosition/ContentRow';

import { useBoundStore } from 'store';

import useSendTx from 'hooks/useSendTx';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

interface IUserPositionData {
  underlying: string;
  delta: string | number;
  markPrice: string;
  entryPrice: string;
  liquidationPrice: string;
  leverage: string;
  putStrike: string;
  state: string | undefined;
  collateral: string;
  initialCollateral: string;
  size: string;
  depositUnderlying: boolean;
  type: 'Long';
}

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ color }) => ({
  '& .MuiTooltip-tooltip': {
    background: color,
  },
}));

export const ActionState: { [key: string]: string } = {
  '0': 'None', // 0
  '1': 'Settled', // 1
  '2': 'Active', // 2
  '3': 'Increase Pending', // 3
  '4': 'Increased', // 5
  '5': 'Enable Pending', // 7
  '6': 'Exit Pending', // 8
};

const UserPositions = () => {
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
  const handleOpenManageModal = useCallback((section: string) => {
    setOnOpenSection(() => section);
    setOpenManageModal(() => true);
  }, []);

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

  const pnlPercentage = useMemo(() => {
    return formatAmount(
      (Number(userPositionData.delta) / Number(userPositionData.collateral)) *
        100,
      2
    );
  }, [userPositionData]);

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
        entryPrice: '0',
        markPrice: '0',
        leverage: '0',
        putStrike: '0',
        delta: '0',
        liquidationPrice: '0',
        state: 'Loading',
        collateral: '0',
        initialCollateral: '0',
        size: '0',
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

      const positionSize = getUserReadableAmount(gmxPosition[0], 30);
      const collateral = getUserReadableAmount(gmxPosition[1], 30);
      const collateralAccess = getUserReadableAmount(
        atlanticsPosition.optionStrike
          .mul(atlanticsPosition.optionsAmount)
          .div(getContractReadableAmount(1, 18)),
        8
      );

      hasProfit = positionDelta[0];

      position = {
        underlying,
        entryPrice: formatAmount(getUserReadableAmount(gmxPosition[2], 30), 3),
        markPrice: formatAmount(getUserReadableAmount(markPrice, 8), 3),
        leverage: formatAmount(
          positionSize / (collateral - collateralAccess),
          1
        ),
        putStrike: formatAmount(
          getUserReadableAmount(atlanticsPosition.optionStrike, 8),
          3
        ),
        delta: hasProfit
          ? getUserReadableAmount(positionDelta[1], 30)
          : getUserReadableAmount(positionDelta[1], 30) * -1,
        liquidationPrice: formatAmount(
          getUserReadableAmount(liquidationPrice, 30),
          3
        ),
        state: ActionState[String(strategyPosition.state)],
        collateral: formatAmount(collateral, 3),
        size: formatAmount(positionSize, 3),
        initialCollateral: formatAmount(collateral - collateralAccess, 3),
        depositUnderlying: strategyPosition.keepCollateral,
        type: 'Long',
      };
    } else {
      position.state = 'None';
    }

    setUserPositionData(() => position);
    setIsPositionReleased(() => strategyPosition.state === 1);
  }, [contractAddresses, signer, accountAddress, atlanticPool]);

  const handleManageButtonClick = useCallback(() => {
    if (userPositionData.state === 'Settled') {
      handleOpenManageModal('MANAGE_POSITION');
      setOpenManageModal(true);
    } else {
      handleOpenManageModal('MANAGE_STRATEGY');
      setOpenManageModal(true);
    }
  }, [handleOpenManageModal, setOpenManageModal, userPositionData.state]);

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

    await sendTx(strategyContract.emergencyStrategyExit(positionId)).then(
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
      console.log(e.target.value);
      setAction(String(e.target.value));
    },
    []
  );

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
      strategyContract.userPositionManagers(accountAddress),
    ]);

    await sendTx(
      strategyContract.reuseStrategy(positionId, expiry, false)
    ).then(() => {
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

  useEffect(() => {
    const interval = setInterval(() => {
      getUserPositions();
    }, 3000);
    return () => clearInterval(interval);
  }, [getUserPositions]);

  return (
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
            <WalletButton>Connect</WalletButton>
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
                            {userPositionData.leverage}x
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
                      <StyledTooltip
                        followCursor
                        arrow={true}
                        color="transparent"
                        title={
                          <Box className="flex flex-col p-2 bg-carbon rounded-lg border border-mineshaft w-[12rem] space-y-2 bg-opacity-50 backdrop-blur-md">
                            <ContentRow
                              title="Initial Collateral:"
                              content={`$${userPositionData.initialCollateral}`}
                              textSize="caption"
                            />
                            <ContentRow
                              title="Put Strike:"
                              content={`$${userPositionData.putStrike}`}
                              textSize="caption"
                            />
                            <ContentRow
                              title="PnL:"
                              content={`${formatAmount(
                                userPositionData.delta,
                                5
                              )}`}
                              textSize="caption"
                              highlightPnl
                            />
                            <ContentRow
                              title="Collateral:"
                              content={`$${formatAmount(
                                userPositionData.collateral,
                                5
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
                            ${userPositionData.collateral}
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
                              userPositionData.delta,
                              5
                            )}(${pnlPercentage}%)`}
                          </Typography>
                        </span>
                      </StyledTooltip>
                    </TableBodyCell>
                    <TableBodyCell>
                      <Typography variant="h6">
                        ${userPositionData.size}
                      </Typography>
                    </TableBodyCell>
                    <TableBodyCell>
                      <Typography variant="h6">
                        ${formatAmount(userPositionData.collateral, 5)}
                      </Typography>
                    </TableBodyCell>
                    <TableBodyCell>
                      <Typography variant="h6">
                        ${userPositionData.markPrice}
                      </Typography>
                    </TableBodyCell>
                    <TableBodyCell>
                      <Typography variant="h6">
                        ${userPositionData.entryPrice}
                      </Typography>
                    </TableBodyCell>
                    <TableBodyCell>
                      <Typography variant="h6">
                        ${userPositionData.liquidationPrice}
                      </Typography>
                    </TableBodyCell>
                    <TableBodyCell align="right">
                      {userPositionData.state === ActionState['5'] ? (
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
                            onClick={handleEmergencyExit}
                            value={'Close'}
                          >
                            <Typography variant="h6">Exit strategy</Typography>
                          </MenuItem>
                        </Select>
                      ) : (
                        <CustomButton onClick={handleManageButtonClick}>
                          Manage
                        </CustomButton>
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
  );
};

export default UserPositions;
