import { useCallback } from 'react';

import TableCell from '@mui/material/TableCell';
// import { BigNumber } from 'ethers';
import TableRow from '@mui/material/TableRow';
import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';

import Button from 'components/UI/Button';
import Typography from 'components/UI/Typography';

import formatAmount from 'utils/general/formatAmount';

interface Props {
  totalCollateral: string | number;
  activeCollateral: string | number;
  accruedPremium: string | number;
  withdrawableCollateral: string | number;
  positionId: number;
  withdrawable: boolean;
  collateralSymbol: string;
}

const TableRowData = (props: Props) => {
  const {
    totalCollateral,
    activeCollateral,
    accruedPremium,
    withdrawableCollateral,
    positionId,
    withdrawable,
    collateralSymbol,
  } = props;

  const sendTx = useSendTx();

  const { appUserData, appContractData, signer, accountAddress } =
    useBoundStore();

  const handleWithdraw = useCallback(async () => {
    const contract = appContractData.contract;
    if (!signer || !appUserData || !contract || !accountAddress) return;

    try {
      await sendTx(contract, 'withdraw', [positionId, accountAddress]);
    } catch (e) {
      console.log(e);
    }
  }, [
    accountAddress,
    appContractData.contract,
    appUserData,
    positionId,
    sendTx,
    signer,
  ]);

  return (
    <TableRow>
      <TableCell className="border-0">
        <Typography variant="h6">
          {formatAmount(totalCollateral, 3)} {collateralSymbol}
        </Typography>
      </TableCell>
      <TableCell className={`border-0`}>
        <Typography
          variant="h6"
          color={Number(accruedPremium) > 0 ? 'emerald-500' : 'stieglitz'}
        >
          {formatAmount(accruedPremium, 3)} {collateralSymbol}
        </Typography>
      </TableCell>
      <TableCell className="border-0" align="right">
        <Typography variant="h6">
          {formatAmount(activeCollateral, 3)} {collateralSymbol}
        </Typography>
      </TableCell>
      <TableCell className="border-0" align="right">
        <Typography variant="h6">
          {formatAmount(withdrawableCollateral, 3)} {collateralSymbol}
        </Typography>
      </TableCell>
      <TableCell className="border-0" align="right">
        <Button onClick={handleWithdraw} disabled={!withdrawable}>
          Withdraw
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TableRowData;
