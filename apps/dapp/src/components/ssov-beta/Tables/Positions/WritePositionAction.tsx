import { Button } from '@dopex-io/ui';
import Countdown from 'react-countdown';
import Spinner from 'svgs/Spinner';
import { Address, useAccount, useContractWrite } from 'wagmi';

import { usePrepareClaim, usePrepareStake } from 'hooks/ssov/usePrepareWrites';
import useVaultStore from 'hooks/ssov/useVaultStore';

import { WritePositionActionButtonProps } from './WritePositions';

const Stake = ({
  tokenId,
  accountAddress,
}: Pick<WritePositionActionButtonProps, 'tokenId'> & {
  accountAddress: Address;
}) => {
  const vault = useVaultStore((vault) => vault.vault);

  const stakeConfig = usePrepareStake({
    ssov: vault.address,
    tokenId: BigInt(tokenId),
    receiver: accountAddress,
  });

  const { write, isLoading } = useContractWrite(stakeConfig);

  return (
    <Button onClick={write} disabled={isLoading}>
      {isLoading ? (
        <div className="flex">
          <Spinner />
          Staking...
        </div>
      ) : (
        'Stake'
      )}
    </Button>
  );
};

const Claim = ({
  tokenId,
  accountAddress,
}: Pick<WritePositionActionButtonProps, 'tokenId'> & {
  accountAddress: Address;
}) => {
  const vault = useVaultStore((vault) => vault.vault);

  const claimConfig = usePrepareClaim({
    ssov: vault.address,
    tokenId: BigInt(tokenId),
    receiver: accountAddress,
  });

  const { write, isLoading } = useContractWrite(claimConfig);

  return (
    <Button onClick={write} disabled={isLoading}>
      {isLoading ? (
        <div className="flex">
          <Spinner />
          Claiming...
        </div>
      ) : (
        'Claim'
      )}
    </Button>
  );
};

const WritePositionAction = ({
  value,
}: {
  value: WritePositionActionButtonProps;
}) => {
  const { address: accountAddress } = useAccount();

  if (value.textContent === 'Stake' && accountAddress) {
    return <Stake tokenId={value.tokenId} accountAddress={accountAddress} />;
  } else if (value.textContent === 'Claim' && accountAddress) {
    return <Claim tokenId={value.tokenId} accountAddress={accountAddress} />;
  }

  return (
    <Button
      key={value.tokenId}
      color={value.disabled ? 'mineshaft' : 'primary'}
      onClick={value.handler}
      disabled={value.disabled}
      className={value.disabled ? 'cursor-not-allowed' : ''}
    >
      {value.disabled ? (
        <Countdown
          date={new Date(value.expiry * 1000)}
          renderer={({ days, hours, minutes }) => {
            return (
              <span className="text-xs md:text-sm text-white pt-1">
                {days}d {hours}h {minutes}m
              </span>
            );
          }}
        />
      ) : (
        value.textContent
      )}
    </Button>
  );
};

export default WritePositionAction;
