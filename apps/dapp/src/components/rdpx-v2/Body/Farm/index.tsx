import Card from 'components/rdpx-v2/Body/Farm/Card';
import CfCard from 'components/rdpx-v2/Body/Farm/CfCard';

import addresses from 'constants/rdpx/addresses';

const Farm = () => {
  return (
    <div className="flex flex-col space-y-2 w-full justify-center lg:flex-row lg:space-x-2 lg:space-y-0">
      <Card
        title="rtETH-WETH"
        subtitle="LP Farm"
        imgSrc={['/images/tokens/rteth.svg', '/images/tokens/weth.svg']}
        disabled={false}
        url="https://curve.fi/#/arbitrum/pools/factory-v2-147/deposit"
      />
      <CfCard
        title="rDPX"
        subtitle="Time-locked"
        imgSrc="/images/tokens/rdpx.svg"
        disabled={false}
        url={`https://arbiscan.io/address/${addresses.communalFarm}`} // todo: replace address
      />
    </div>
  );
};

export default Farm;
