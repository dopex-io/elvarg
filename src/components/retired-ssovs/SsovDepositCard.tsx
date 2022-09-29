import { Box } from '@mui/material';
import { BigNumber } from 'ethers';

import SsovV2Deposit from './SsovV2Deposit';
import SsovV3Deposit from './SsovV3Deposit';

const SsovDepositCard = (props: any) => {
  const { ssov } = props;

  if (ssov.version === 2) {
    const _deposits: any = [];

    ssov.userDeposits.forEach((epochDeposits: BigNumber[], epoch: number) => {
      epochDeposits.forEach((deposit: BigNumber, strikeIndex: number) => {
        if (!deposit.isZero()) {
          _deposits.push({
            ssovAddress: ssov.address,
            epoch: epoch + 1,
            strikeIndex,
            amount: deposit,
          });
        }
      });
    });

    if (_deposits.length > 0) {
      return (
        <>
          <Box className="mb-2">{ssov.symbol}</Box>
          {_deposits.map((d: any, index: number) => {
            return <SsovV2Deposit key={index} deposit={d} />;
          })}
        </>
      );
    }
  } else {
    if (ssov.userWritePositions.length > 0) {
      return (
        <>
          {ssov.userWritePositions.map((id: BigNumber, index: number) => {
            return (
              <SsovV3Deposit key={index} id={id} ssovAddress={ssov.address} />
            );
          })}
        </>
      );
    }
  }

  return <>Nothing Found</>;
};

export default SsovDepositCard;
