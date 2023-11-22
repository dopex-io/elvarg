import { Button } from '@dopex-io/ui';

import useRewardAPR from 'hooks/rdpx/useRewardAPR';

import { formatAmount } from 'utils/general';

import CardHero from './CardHero';
import ProductCard from './ProductCard';

interface VaultRowProps {
  name: string;
  imageURL: string;
  vaultURL: string;
  tvl: number;
  apy: number;
}

const VaultRow = ({ name, vaultURL, imageURL, apy, tvl }: VaultRowProps) => {
  return (
    <div className="grid grid-cols-3 items-center">
      <span className="flex space-x-2 items-center">
        <img src={imageURL} alt={`eth-token-image`} className="w-8 h-auto" />
        <span className="text-sm">{name}</span>
      </span>
      {/* <span className="text-wave-blue"> */}
      {/* {formatAmount(tvl)} <span className="text-xs text-white">TVL</span> */}
      {/* </span> */}
      <span className="text-up-only">
        {apy.toFixed()}% <span className="text-xs text-white">APY</span>
      </span>
      <Button
        variant="outlined"
        onClick={() => {
          window.open(vaultURL, '_blank');
        }}
      >
        Deposit
      </Button>
    </div>
  );
};

const RdpxV2Card = () => {
  const { ppvRewardAPR, rtRewardAPR } = useRewardAPR();

  return (
    <ProductCard>
      <CardHero
        name="rDPX V2"
        description="Use rDPX & ETH to earn yield"
        apy={
          Number(rtRewardAPR) > Number(ppvRewardAPR)
            ? Number(rtRewardAPR)
            : Number(ppvRewardAPR)
        }
      />
      <div className="flex flex-col space-y-4">
        <VaultRow
          vaultURL="/rdpx-v2/bond"
          name="rtETH"
          imageURL="/images/tokens/rteth.svg"
          apy={Number(rtRewardAPR)}
          tvl={0}
        />
        <VaultRow
          vaultURL="/rdpx-v2/lp"
          name="Perp PUT Vault"
          imageURL="/images/tokens/eth.svg"
          apy={Number(ppvRewardAPR)}
          tvl={0}
        />
      </div>
    </ProductCard>
  );
};

export default RdpxV2Card;
