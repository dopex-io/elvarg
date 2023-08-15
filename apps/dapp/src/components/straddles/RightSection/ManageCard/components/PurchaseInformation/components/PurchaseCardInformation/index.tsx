import { collateralTokenSymbol } from '../..';

type PurchaseCardInformationProps = {
  totalCost: string;
  funding: string;
  optionsSize: string;
};

const PurchaseCardInformation = (props: PurchaseCardInformationProps) => {
  return (
    <div className="w-full h-full bg-umbra rounded-md p-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-stieglitz text-sm">Options Size</span>
        <span className="text-sm">{props.optionsSize}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-stieglitz text-sm">Funding</span>
        <span className="text-sm">{props.funding}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-stieglitz text-sm">You will pay</span>
        <span className="text-sm">
          {props.totalCost}
          <span className="text-sm text-stieglitz ml-1">
            {collateralTokenSymbol}
          </span>
        </span>
      </div>
    </div>
  );
};

export default PurchaseCardInformation;
