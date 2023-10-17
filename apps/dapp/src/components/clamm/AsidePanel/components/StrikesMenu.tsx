import { Menu, Skeleton } from '@dopex-io/ui';

import { DepositStrike, PurchaseStrike } from 'store/Vault/clamm';

export type Strike = {
  tickLower: number;
  tickUpper: number;
  tickLowerPrice: number;
  tickUpperPrice: number;
  optionsAvailable?: string;
};

type StrikesMenuProps = {
  strikes: (PurchaseStrike | DepositStrike)[];
  selectedStrike: PurchaseStrike | DepositStrike;
  setSelectedStrike: (e: PurchaseStrike | DepositStrike) => void;
  loading: boolean;
};

const StrikesMenu = ({
  strikes,
  selectedStrike,
  loading,
  setSelectedStrike,
}: StrikesMenuProps) => (
  <div className="flex bg-umbra rounded-l-md p-3 w-1/2">
    <div className="flex flex-col justify-end">
      <span className="text-stieglitz text-sm">Strike</span>
      {loading || strikes.length === 0 ? (
        <div className="w-full mt-1">
          <Skeleton
            width={120}
            height={40}
            variant="rounded"
            color="mineshaft"
          />
        </div>
      ) : (
        <Menu<DepositStrike | PurchaseStrike>
          color="mineshaft"
          scrollable
          dropdownVariant="icon"
          setSelection={setSelectedStrike}
          selection={selectedStrike ?? strikes[0]}
          data={strikes}
          showArrow={strikes.length !== 0}
        />
      )}
    </div>
  </div>
);
export default StrikesMenu;
