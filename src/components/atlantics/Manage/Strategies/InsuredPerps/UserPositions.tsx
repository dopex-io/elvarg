import { GmxVault__factory, LongPerpStrategy__factory } from '@dopex-io/sdk';
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
import React, { useCallback, useContext, useEffect, useState } from 'react';
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

import { AtlanticsContext } from 'contexts/Atlantics';
import { WalletContext } from 'contexts/Wallet';

import { MIN_EXECUTION_FEE } from 'constants/gmx';

interface IGMXPosition {
  positionSize: string;
  positionBalance: string;
  entryPrice: string;
  leverage: string;
  status: string;
  pnl: string;
  index: number;
  isCollateralOptionToken: boolean;
}

type IGMXPositionArray = [
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  boolean,
  BigNumber
];

const UserPositions = () => {
  const { signer, accountAddress, contractAddresses, provider } =
    useContext(WalletContext);
  const { selectedPool } = useContext(AtlanticsContext);
  const [gmxPositions, setGmxPositions] = useState<IGMXPosition[]>([]);

  const sendTx = useSendTx();

  const getUserPositions = useCallback(async () => {
    if (!contractAddresses || !accountAddress || !provider || !selectedPool)
      return;
    const strategyContractAddress: string =
      contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'];
    const gmxVaultAddress: string = contractAddresses['GMX-VAULT'];
    const { underlying } = selectedPool.tokens;

    if (!underlying) return;

    const strategyContract = LongPerpStrategy__factory.connect(
      strategyContractAddress,
      provider
    );

    const gmxVaultContract = GmxVault__factory.connect(
      gmxVaultAddress,
      provider
    );

    let markPrice: BigNumber = await gmxVaultContract.getMaxPrice(
      contractAddresses[underlying]
    );

    let userStrategyPositions: any =
      await strategyContract.getAllStrategyPositions();

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

    const gmxPositions: IGMXPosition[] = positions.map((position, index) => {
      const initialValue = getUserReadableAmount(
        position[0]
          .mul(oneEBigNumber(30))
          .div(position[2])
          .mul(position[2])
          .div(oneEBigNumber(30)),
        30
      );

      const currentValue = getUserReadableAmount(
        position[0]
          .mul(oneEBigNumber(30))
          .div(position[2])
          .mul(markPrice)
          .div(oneEBigNumber(30)),
        30
      );

      return {
        positionSize: formatAmount(getUserReadableAmount(position[0], 30), 2),
        positionBalance: formatAmount(
          getUserReadableAmount(position[1], 30),
          3
        ),
        entryPrice: formatAmount(getUserReadableAmount(position[2], 30), 3),
        leverage: formatAmount(
          getUserReadableAmount(
            position[0].mul(oneEBigNumber(30)).div(position[1]),
            30
          ),
          1
        ),
        status: statuses[index] ? 'Released' : 'Active',
        pnl: formatAmount(currentValue - initialValue, 3),
        index: Number(userStrategyPositionsWithIndex[index]?.index),
        isCollateralOptionToken:
          userStrategyPositionsWithIndex[index]?.position.insurance
            .isCollateralOptionToken ?? false,
      };
    });

    setGmxPositions(() => gmxPositions);
  }, [contractAddresses, provider, accountAddress, selectedPool]);

  const closePosition = useCallback(
    async (index: number) => {
      if (!contractAddresses || !accountAddress || !signer || !selectedPool)
        return;
      try {
        const strategyContractAddress: string =
          contractAddresses['STRATEGIES']['INSURED-PERPS']['STRATEGY'];

        const strategyContract = LongPerpStrategy__factory.connect(
          strategyContractAddress,
          signer
        );

        const tx = strategyContract.exitStrategy(index, {
          value: MIN_EXECUTION_FEE,
        });
        await sendTx(tx);
      } catch (err) {
        console.log(err);
      }
    },
    [accountAddress, contractAddresses, selectedPool, signer, sendTx]
  );

  const keepCollateral = useCallback(
    async (index: number) => {
      if (!contractAddresses || !accountAddress || !signer || !selectedPool)
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
    [accountAddress, contractAddresses, selectedPool, signer, sendTx]
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
                    <Typography variant="h6">{position.leverage}x</Typography>
                  </TableBodyCell>
                  <TableBodyCell>
                    <Typography
                      className={`${
                        Number(position.pnl) > 0
                          ? 'text-green-500'
                          : 'text-white'
                      }`}
                      variant="h6"
                    >
                      {position.pnl}
                    </Typography>
                  </TableBodyCell>
                  <TableBodyCell>
                    <Typography variant="h6">{position.status}</Typography>
                  </TableBodyCell>
                  <TableBodyCell align="right">
                    <ActionButton
                      closePosition={closePosition}
                      keepCollateral={keepCollateral}
                      isCollateralOptionToken={position.isCollateralOptionToken}
                      index={position.index}
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
}

const ActionButton = ({
  closePosition,
  keepCollateral,
  isCollateralOptionToken,
  index,
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
          <MenuItem onClick={handleKeepCollateral}>
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
