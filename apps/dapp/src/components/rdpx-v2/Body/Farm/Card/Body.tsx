import { useAccount } from 'wagmi';

import Typography2 from 'components/UI/Typography2';

const Body = () => {
  const { address: user = '0x' } = useAccount();
  return (
    <div className="h-fit bg-umbra p-3 rounded-md text-center">
      {!user ? (
        <Typography2 variant="caption" color="stieglitz">
          Connect your wallet
        </Typography2>
      ) : (
        <Typography2 variant="caption" color="stieglitz">
          Your staked position will appear here.
        </Typography2>
      )}
    </div>
  );
};

export default Body;
