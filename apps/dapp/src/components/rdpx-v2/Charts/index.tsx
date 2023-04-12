import dynamic from 'next/dynamic';

const ClientRenderedPriceChart = dynamic(() => import('./PriceChart'), {
  ssr: false,
});

const ClientRenderedDpxethSupplyChart = dynamic(
  () => import('./DpxethSupply'),
  {
    ssr: false,
  }
);

const Charts = () => {
  return (
    <div className="flex flex-col sm:flex-col md:flex-row space-y-3 sm:space-y-3 md:space-y-0 sm:space-x-0 md:space-x-3">
      <div className="flex flex-col bg-cod-gray rounded-lg divide-y divide-umbra w-full md:w-1/2 sm:w-full">
        <ClientRenderedDpxethSupplyChart data={[]} width={255} height={167.5} />
      </div>
      <div className="flex flex-col bg-cod-gray rounded-lg divide-y divide-umbra w-full md:w-1/2 sm:w-full">
        <ClientRenderedPriceChart data={[]} width={900} height={180} />
      </div>
    </div>
  );
};

export default Charts;
