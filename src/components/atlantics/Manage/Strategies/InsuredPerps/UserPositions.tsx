import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  GmxVault__factory,
  InsuredLongsStrategy__factory,
  InsuredLongsUtils__factory,
} from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import CustomButton from 'components/UI/Button';
import Typography from 'components/UI/Typography';
import {
  TableHeader,
  TableBodyCell,
} from 'components/atlantics/Manage/UserDepositsTable';

import ManageModal from 'components/atlantics/Dialogs/InsuredPerps/ManageDialog';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import { useBoundStore } from 'store';

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
  depositUnderlying: boolean;
}

export const ActionState: { [key: string]: string } = {
  '0': 'None', // 0
  '1': 'Settled', // 1
  '2': 'Active', // 2
  '3': 'Increase Pending', // 3
  '4': 'Decrease Pending', // 4
  '5': 'Increased', // 5
  '6': 'Decreased', // 6
  '7': 'Enable Pending', // 7
  '8': 'Complete Exit Pending', // 8
  '9': 'Complete Exit With IncreasePending', // 9
  '10': 'Exit Strategy Keep Position Pending', // 10
};

const UserPositions = () => {
  const { signer, accountAddress, contractAddresses, atlanticPool } =
    useBoundStore();

  // const [openPositionManager, setOpenPositionManager] =
  //   useState<boolean>(false);

  const [openManageModal, setOpenManageModal] = useState<boolean>(false);
  const [onOpenSection, setOnOpenSection] = useState<string>('MANAGE_STRATEGY');
  const [, setIsPositionReleased] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenManageModal = useCallback((section: string) => {
    setOnOpenSection(() => section);
    setOpenManageModal(() => true);
  }, []);

  // const closePositionManager = useCallback(() => {
  //   setOpenPositionManager(false);
  // }, []);

  const [userPositionData, setUserPositionData] = useState<IUserPositionData>({
    underlying: '',
    delta: '0',
    markPrice: '0',
    entryPrice: '0',
    liquidationPrice: '0',
    leverage: '0',
    putStrike: '0',
    state: 'None',
    collateral: '0',
    depositUnderlying: false,
  });

  const pnlPercentage = useMemo(() => {
    return formatAmount(
      (Math.abs(Number(userPositionData.delta)) /
        Number(userPositionData.collateral)) *
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

    const signerAddress = await signer.getAddress();
    const [positionId, positionManager] = await Promise.all([
      strategyContract.userPositionIds(signerAddress),
      strategyContract.userPositionManagers(signerAddress),
    ]);

    const gmxPosition = await gmxVault.getPosition(
      positionManager,
      underlyingAddress,
      underlyingAddress,
      true
    );

    if (gmxPosition[0].isZero()) return;

    const strategyPosition = await strategyContract.strategyPositions(
      positionId
    );

    const [
      atlanticsPosition,
      leverage,
      positionDelta,
      liquidationPrice,
      markPrice,
    ] = await Promise.all([
      atlanticPool.contracts.atlanticPool.getOptionsPurchase(
        strategyPosition.atlanticsPurchaseId
      ),
      gmxVault.getPositionLeverage(
        positionManager,
        underlyingAddress,
        underlyingAddress,
        true
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

    const hasProfit = positionDelta[0];
    const position: IUserPositionData = {
      underlying,
      entryPrice: formatAmount(getUserReadableAmount(gmxPosition[2], 30), 3),
      markPrice: formatAmount(getUserReadableAmount(markPrice, 8), 3),
      leverage: formatAmount(getUserReadableAmount(leverage, 4) + 0.1, 1),
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
      collateral: formatAmount(getUserReadableAmount(gmxPosition[1], 30), 3),
      depositUnderlying: strategyPosition.keepCollateral,
    };

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
      {/* <CustomButton onClick={handleClickMenu}>Test Modals</CustomButton> */}
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
      {userPositionData.state === 'None' ? (
        <Box className="w-full text-center bg-cod-gray rounded-xl py-8">
          <CustomButton onClick={() => handleOpenManageModal('USE_STRATEGY')}>
            <Typography variant="h6">Open Position</Typography>
          </CustomButton>
        </Box>
      ) : (
        <TableContainer className="rounded-xl max-h-80 w-full overflow-x-auto pb-4">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Entry</TableHeader>
                <TableHeader>Balance</TableHeader>
                <TableHeader>Leverage</TableHeader>
                <TableHeader>PnL</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Liqudation Price</TableHeader>
                <TableHeader>Put Strike</TableHeader>
                <TableHeader align="right">Action</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableBodyCell>
                  <Typography variant="h6">
                    ${userPositionData.entryPrice}
                  </Typography>
                </TableBodyCell>
                <TableBodyCell>
                  <Typography variant="h6">
                    ${userPositionData.collateral}
                  </Typography>
                </TableBodyCell>
                <TableBodyCell>
                  <Typography variant="h6">
                    {userPositionData.leverage}x
                  </Typography>
                </TableBodyCell>
                <TableBodyCell>
                  <Typography
                    className={`${
                      Number(userPositionData.delta) > 0
                        ? 'text-green-500'
                        : 'text-red-400'
                    }`}
                    variant="h6"
                  >
                    {formatAmount(userPositionData.delta, 5)}{' '}
                    {`(${pnlPercentage}%)`}
                  </Typography>
                </TableBodyCell>
                <TableBodyCell>
                  <Typography variant="h6">{userPositionData.state}</Typography>
                </TableBodyCell>
                <TableBodyCell>
                  <Typography variant="h6">
                    {userPositionData.liquidationPrice}
                  </Typography>
                </TableBodyCell>
                <TableBodyCell>
                  <Typography variant="h6">
                    {userPositionData.putStrike}
                  </Typography>
                </TableBodyCell>
                <TableBodyCell align="right">
                  <CustomButton onClick={handleManageButtonClick}>
                    Manage
                  </CustomButton>
                </TableBodyCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default UserPositions;
