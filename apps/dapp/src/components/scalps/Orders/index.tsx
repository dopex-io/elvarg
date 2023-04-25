import displayAddress from 'utils/general/displayAddress';

import { useBoundStore } from 'store';

import OrdersTable from './OrdersTable';

const Orders = () => {
  const { accountAddress, ensName } = useBoundStore();

  return (
    <div className="text-gray-400 min-w-[60vw] rounded-lg">
      <div className="border rounded-t-xl border-cod-gray py-2 bg-umbra">
        <div className="flex ml-3">
          <div className="rounded-md bg-neutral-700 flex mb-2 mt-3 h-auto">
            <span className="ml-auto p-1 text-white text-xs">
              {displayAddress(accountAddress, ensName)}
            </span>
          </div>
          <h6 className="ml-auto mr-3.5 mt-2.5">
            <span className="text-stieglitz">Active limit orders</span>
          </h6>
        </div>
      </div>
      <div className="border rounded-b-xl border-cod-gray border-t-neutral-800 bg-umbra">
        <OrdersTable />
      </div>
    </div>
  );
};

export default Orders;
