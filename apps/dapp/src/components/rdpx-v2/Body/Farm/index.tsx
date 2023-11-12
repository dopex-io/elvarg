import Card from 'components/rdpx-v2/Body/Farm/Card';

const Farm = () => {
  return (
    <div className="flex w-full space-x-2">
      <Card
        title="DPXETH-WETH"
        subtitle="LP Farm"
        imgSrc={['/images/tokens/dpxeth.svg', '/images/tokens/weth.svg']}
        disable={true}
        url="https://arbiscan.io"
      />
      <Card
        title="rtETH-WETH"
        subtitle="LP Farm"
        imgSrc={['/images/tokens/rdpx.svg', '/images/tokens/weth.svg']}
        disable={true}
        url="https://arbiscan.io"
      />
    </div>
  );
};

export default Farm;
