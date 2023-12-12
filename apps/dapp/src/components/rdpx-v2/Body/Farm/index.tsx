import Card from 'components/rdpx-v2/Body/Farm/Card';
import CfCard from 'components/rdpx-v2/Body/Farm/CfCard';

const Farm = () => {
  return (
    <div className="flex w-full space-x-2 justify-center">
      <Card
        title="rtETH-WETH"
        subtitle="LP Farm"
        imgSrc={['/images/tokens/rteth.svg', '/images/tokens/weth.svg']}
        disabled={false}
        url="https://curve.fi/#/arbitrum/pools/factory-v2-147/deposit"
      />
      <CfCard
        title="rDPX"
        subtitle="Time-locked Farm"
        imgSrc="/images/tokens/rdpx.svg"
        disabled={false}
        url="https://etherscan.io/address/0x33890B88F98a9D511678954AD8DB0510B6953Cfc" // todo: replace address
      />
    </div>
  );
};

export default Farm;
