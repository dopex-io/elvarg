import dynamic from 'next/dynamic';

const ClientRenderedPriceChart = dynamic(() => import('./PriceChart'), {
  ssr: false,
});

const ClientRenderedSupplyChart = dynamic(() => import('./SupplyChart'), {
  ssr: false,
});

const Charts = () => {
  return (
    <div className="flex flex-col sm:flex-col md:flex-row space-y-3 sm:space-y-3 md:space-y-0 divide-x divide-cod-gray h-full min-h-[210px]">
      <div className="flex flex-col w-full md:w-1/2 sm:w-full">
        <ClientRenderedSupplyChart data={[]} width={255} height={170} />
      </div>
      <div className="flex flex-col w-full md:w-1/2 sm:w-full">
        <ClientRenderedPriceChart data={[]} width={255} height={180} />
      </div>
    </div>
  );
};

export default Charts;