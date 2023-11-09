import dynamic from 'next/dynamic';

const ClientRenderedRdpxSupplyChart = dynamic(() => import('./RdpxSupply'), {
  ssr: false,
});

const ClientRenderedReceiptTokenSupplyChart = dynamic(
  () => import('./ReceiptTokenSupply'),
  {
    ssr: false,
  },
);

const Charts = () => {
  return (
    <div className="flex flex-col sm:flex-col md:flex-row space-y-3 sm:space-y-3 md:space-y-0 divide-x-0 md:divide-x-2 divide-y-2 md:divide-y-0 divide-cod-gray h-full">
      <div className="flex flex-col w-full md:w-1/2 sm:w-full">
        <ClientRenderedReceiptTokenSupplyChart
          data={[]}
          width={255}
          height={180}
        />
      </div>
      <div className="flex flex-col w-full md:w-1/2 sm:w-full">
        <ClientRenderedRdpxSupplyChart data={[]} width={255} height={180} />
      </div>
    </div>
  );
};

export default Charts;
