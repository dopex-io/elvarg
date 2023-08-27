import { Button } from '@dopex-io/ui';

import RowItem from 'components/ssov-beta/AsidePanel/RowItem';

interface Props {
  inputPanel: React.ReactNode;
  data: { label: string; value: string | React.ReactNode }[];
  button: {
    label: string;
    handler: (e: any) => void;
    disabled: boolean;
  };
}

const Trade = (props: Props) => {
  const { inputPanel, data, button } = props;
  return (
    <div className="space-y-3">
      <div className="bg-umbra rounded-xl divide-y divide-cod-gray">
        {inputPanel}
        <div className="flex w-full divide-x divide-cod-gray">
          <div className="flex-grow p-3">
            <h3 className="text-xs text-stieglitz">Expiry</h3>
          </div>
          <div className="flex-grow p-3">
            <h3 className="text-xs text-stieglitz">Side</h3>
          </div>
        </div>
        <div className="p-3">
          <div className="flex justify-between">
            <h3 className="text-down-bad text-xs">Strike Selector N/A</h3>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-umbra rounded-xl p-3 space-y-2">
        {data.map((itm, idx) => (
          <RowItem key={idx} label={itm.label} content={itm.value} />
        ))}
        <Button
          className="flex-grow text-sm justify-center font-normal transition ease-in-out duration-200 bg-carbon"
          onClick={() => {}}
          color="mineshaft"
          size="small"
        >
          Add Margin
        </Button>
        <Button
          className="flex-grow text-sm justify-center font-normal transition ease-in-out duration-200 bg-carbon"
          onClick={button.handler}
          disabled={button.disabled}
          size="small"
        >
          {button.label}
        </Button>
      </div>
    </div>
  );
};

export default Trade;
