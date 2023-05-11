import Button from '@mui/material/Button';
import { useSwitchNetwork } from 'wagmi';

import CtaBanner from 'components/UI/CtaBanner';

const FarmingMigrationBanner = () => {
  const { switchNetwork } = useSwitchNetwork();

  const handleClick = () => switchNetwork && switchNetwork(42161);

  return (
    <CtaBanner
      title="Farms Migrated to Arbitrum 🚀"
      paragraph="Farms have been migrated to Arbitrum L2 network, enjoy faster transactions with cheaper gas!"
      rightElement={
        <Button
          onClick={handleClick}
          variant="outlined"
          className="bg-white text-primary dark:border-transparent hover:bg-gray-200 h-16 mb-3 md:mb-0 md:h-10 border-primary lg:w-60 w-full mt-4 md:mt-0"
          classes={{ root: 'text-lg md:text-sm' }}
        >
          Connect to Arbitrum
        </Button>
      }
    />
  );
};

export default FarmingMigrationBanner;
