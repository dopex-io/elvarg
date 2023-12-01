import Card from 'components/rdpx-v2/Body/Farm/Card';

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
    </div>
  );
};

export default Farm;
