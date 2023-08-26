import { Button } from '@dopex-io/ui';

interface Props {
  inputPanel: React.ReactNode;
  data: { label: string; value: string | React.ReactNode }[];
}

const LiquidityProvision = (props: Props) => {
  const { inputPanel, data } = props;

  return (
    <div className="space-y-3">
      <div className="bg-umbra rounded-xl divide-y divide-cod-gray">
        {inputPanel}
        <div className="flex flex-col p-3">
          <p className="text-xs text-stieglitz">Expiry</p>
          <p className="text-lg self-center">Dropdown</p>
        </div>
      </div>
      <div className="border border-carbon rounded-lg divide-y divide-carbon">
        {data.map((item, idx) => {
          return (
            <div key={idx} className="flex justify-between text-xs p-3">
              <p className="text-stieglitz">{item.label}</p>
              <p>{item.value}</p>
            </div>
          );
        })}
      </div>
      <div className="bg-umbra p-3 rounded-lg space-y-3">
        <div className="flex justify-between text-xs">
          <p className="text-stieglitz">You will get</p>
          <p>-</p>
        </div>
        <Button size="small" className="w-full" disabled={true}>
          Input Amount
        </Button>
      </div>
    </div>
  );
};

export default LiquidityProvision;
