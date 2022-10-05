import { useCallback, useEffect, useState } from 'react';
import {
  GmxVault__factory,
  LongPerpStrategyViewer__factory,
  LongPerpStrategy__factory,
} from '@dopex-io/sdk';
import {
  Box,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { BigNumber } from 'ethers';

import Typography from 'components/UI/Typography';
import {
  TableHeader,
  TableBodyCell,
} from 'components/atlantics/Manage/UserDepositsTable';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';
import oneEBigNumber from 'utils/math/oneEBigNumber';

import useSendTx from 'hooks/useSendTx';

import { useBoundStore } from 'store';

import { MIN_EXECUTION_FEE } from 'constants/gmx';

interface IGMXPosition {
  positionSize: string;
  positionBalance: string;
  entryPrice: number;
  leverage: number;
  status: string;
  pnl: number;
  index: number;
  isCollateralOptionToken: boolean;
  liquidationPrice: number;
  putStrike: number;
  hasBorrowed: boolean;
}

type IGMXPositionArray = [
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  boolean,
  BigNumber
];

const UserPositions = () => {
  const { signer, accountAddress, contractAddresses, provider, atlanticPool } =
    useBoundStore();
  const [gmxPositions, setGmxPositions] = useState<IGMXPosition[]>([]);

  const sendTx = useSendTx();

  const getUserPositions = useCallback(async () => {
    if (!contractAddresses || !accountAddress || !provider || !atlanticPool)
      return;
    const strategyContractAddress: string =
      contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'];
    const strategyViewerAddress =
      contractAddresses['STRATEGIES']['INSURED-PERPS']['VIEWER'];
    const gmxVaultAddress: string = contractAddresses['GMX-VAULT'];
    const { underlying } = atlanticPool.tokens;

    if (!underlying) return;

    const strategyContract = LongPerpStrategy__factory.connect(
      strategyContractAddress,
      provider
    );

    const gmxVaultContract = GmxVault__factory.connect(
      gmxVaultAddress,
      provider
    );

    let userStrategyPositions: any[] =
      await LongPerpStrategyViewer__factory.connect(
        strategyViewerAddress,
        provider
      ).getStrategyPositions(strategyContract.address);

    let userStrategyPositionsWithIndex: {
      position: any;
      index: number;
    }[] = [];

    userStrategyPositions.map((position: any, index: any) => {
      if (
        !position.insurance.expiry.isZero() &&
        position.user === accountAddress
      ) {
        userStrategyPositionsWithIndex.push({
          position,
          index,
        });
      } else {
        return;
      }
    });

    let userGmxPositionsCalls: any = [];

    userStrategyPositionsWithIndex.forEach((_position) => {
      if (_position) {
        userGmxPositionsCalls.push(
          gmxVaultContract.getPosition(
            _position.position.dopexPositionManager,
            contractAddresses[underlying],
            contractAddresses[underlying],
            true
          )
        );
      } else return;
    });

    let strategyPositionsStatusCalls = userStrategyPositionsWithIndex.map(
      (position) => {
        return strategyContract.isPositionSettled(position.index);
      }
    );

    const positions: IGMXPositionArray[] = await Promise.all(
      userGmxPositionsCalls
    );

    const statuses = await Promise.all(strategyPositionsStatusCalls);
    const gmxPositions: IGMXPosition[] = [];

    for (const index in positions) {
      const position = positions[index];
      if (!position) return;
      if (!position[7] || !position[2] || !position[0]) return;

      const _pnlDetails = await gmxVaultContract.getDelta(
        contractAddresses[underlying],
        position[0],
        position[2],
        true,
        position[7]
      );

      const _pnl: any = _pnlDetails[0]
        ? _pnlDetails[1]
        : Number(_pnlDetails[1]) * -1;

      const _entryPrice = getUserReadableAmount(position[2], 30);
      const _leverage = getUserReadableAmount(
        position[0].mul(oneEBigNumber(30)).div(position[1]),
        30
      );
      const _liqudationPrice = _entryPrice - _entryPrice / _leverage;

      const _position = {
        positionSize: formatAmount(getUserReadableAmount(position[0], 30), 2),
        positionBalance: formatAmount(
          getUserReadableAmount(position[1], 30),
          3
        ),
        entryPrice: _entryPrice,
        leverage: _leverage,
        status: statuses[index] ? 'Released' : 'Active',
        pnl: getUserReadableAmount(_pnl, 30),
        index: Number(userStrategyPositionsWithIndex[index]?.index),
        isCollateralOptionToken:
          userStrategyPositionsWithIndex[index]?.position.insurance
            .isCollateralOptionToken ?? false,
        liquidationPrice: _liqudationPrice,
        putStrike: getUserReadableAmount(
          userStrategyPositionsWithIndex[index]?.position.insurance.putStrike,
          8
        ),
        hasBorrowed:
          userStrategyPositionsWithIndex[index]?.position.insurance.hasBorrowed,
      };

      gmxPositions[index] = _position;
    }

    setGmxPositions(() => gmxPositions);
  }, [contractAddresses, provider, accountAddress, atlanticPool]);

  const closePosition = useCallback(
    async (index: number) => {
      if (!contractAddresses || !accountAddress || !signer || !atlanticPool)
        return;
      try {
        const strategyContractAddress: string =
          contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'];

        const strategyContract = LongPerpStrategy__factory.connect(
          strategyContractAddress,
          signer
        );

        const tx = strategyContract.exitStrategyAndLongPosition(index, {
          value: MIN_EXECUTION_FEE,
        });
        await sendTx(tx);
      } catch (err) {
        console.log(err);
      }
    },
    [accountAddress, contractAddresses, atlanticPool, signer, sendTx]
  );

  const keepCollateral = useCallback(
    async (index: number) => {
      if (!contractAddresses || !accountAddress || !signer || !atlanticPool)
        return;
      try {
        const strategyContractAddress: string =
          contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'];
        const strategyContract = LongPerpStrategy__factory.connect(
          strategyContractAddress,
          signer
        );

        const tx = strategyContract.keepCollateral(index, {
          value: MIN_EXECUTION_FEE,
        });
        await sendTx(tx);
      } catch (err) {
        console.log(err);
      }
    },
    [accountAddress, contractAddresses, atlanticPool, signer, sendTx]
  );

  useEffect(() => {
    getUserPositions();
  }, [getUserPositions]);
  return (
    <>
      {gmxPositions.length !== 0 ? (
        <TableContainer className="rounded-xl max-h-80 w-full overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Entry</TableHeader>
                <TableHeader>Balance</TableHeader>
                <TableHeader>Size</TableHeader>
                <TableHeader>Leverage</TableHeader>
                <TableHeader>PnL</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Liqudation Price</TableHeader>
                <TableHeader>Put Strike</TableHeader>
                <TableHeader align="right">Action</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {gmxPositions.map((position, index) => (
                <TableRow key={index}>
                  <TableBodyCell>
                    <Typography variant="h6">${position.entryPrice}</Typography>
                  </TableBodyCell>
                  <TableBodyCell>
                    <Typography variant="h6">
                      ${position.positionBalance}
                    </Typography>
                  </TableBodyCell>
                  <TableBodyCell>
                    <Typography variant="h6">
                      ${position.positionSize}
                    </Typography>
                  </TableBodyCell>
                  <TableBodyCell>
                    <Typography variant="h6">
                      {formatAmount(position.leverage, 1)}x
                    </Typography>
                  </TableBodyCell>
                  <TableBodyCell>
                    <Typography
                      className={`${
                        Number(position.pnl) > 0
                          ? 'text-green-500'
                          : 'text-red-400'
                      }`}
                      variant="h6"
                    >
                      {formatAmount(position.pnl, 3)}
                    </Typography>
                  </TableBodyCell>
                  <TableBodyCell>
                    <Typography variant="h6">{position.status}</Typography>
                  </TableBodyCell>
                  <TableBodyCell>
                    <Typography variant="h6">
                      {formatAmount(position.liquidationPrice, 2)}
                    </Typography>
                  </TableBodyCell>
                  <TableBodyCell>
                    <Typography variant="h6">{position.putStrike}</Typography>
                  </TableBodyCell>
                  <TableBodyCell align="right">
                    <ActionButton
                      closePosition={closePosition}
                      keepCollateral={keepCollateral}
                      isCollateralOptionToken={position.isCollateralOptionToken}
                      index={position.index}
                      hasBorrowed={position.hasBorrowed}
                    />
                  </TableBodyCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box className="w-full text-center bg-cod-gray rounded-xl p-4">
          <Typography variant="h6">No Positions Found</Typography>
        </Box>
      )}
    </>
  );
};

interface IActionButtonProps {
  closePosition: (index: number) => Promise<void>;
  keepCollateral: (index: number) => Promise<void>;
  index: number;
  isCollateralOptionToken: boolean;
  hasBorrowed: boolean;
}

const ActionButton = ({
  closePosition,
  keepCollateral,
  isCollateralOptionToken,
  index,
  hasBorrowed,
}: IActionButtonProps) => {
  const handleClosePosition = useCallback(async () => {
    await closePosition(index);
  }, [closePosition, index]);

  const handleKeepCollateral = useCallback(async () => {
    await keepCollateral(index);
  }, [keepCollateral, index]);

  return (
    <Box className="flex justify-end">
      <Select
        className="bg-primary rounded-md h-[2rem] text-white w-[8rem]"
        displayEmpty
        renderValue={() => {
          return (
            <Typography
              variant="h6"
              className="text-white text-center w-full relative"
            >
              {'Settle'}
            </Typography>
          );
        }}
        MenuProps={{
          classes: {
            paper: 'bg-umbra',
          },
        }}
        classes={{
          icon: 'text-white',
        }}
      >
        <MenuItem onClick={handleClosePosition}>
          <Typography
            variant="h6"
            role="button"
            className="flex-1 font-xs w-full"
          >
            Close Position
          </Typography>
        </MenuItem>
        {!isCollateralOptionToken && (
          <MenuItem onClick={handleKeepCollateral} disabled={!hasBorrowed}>
            <Typography
              variant="h6"
              role="button"
              className="flex-1 font-xs w-full"
            >
              Keep Collateral
            </Typography>
          </MenuItem>
        )}
      </Select>
    </Box>
  );
};

export default UserPositions;
