interface Props {
  statsObject: Record<string, string | number>;
}

const Stats = (props: Props) => {
  const { statsObject } = props;

  return (
    <div className="grid grid-flow-row grid-cols-2">
      {Object.keys(statsObject).map((key: string, index) => {
        let rounding;
        let border;
        const len = Object.keys(statsObject).length;

        if (index === 0) {
          rounding = 'rounded-tl-lg';
          border = 'border-y border-l border-r';
        } else if (index === 1) {
          rounding = 'rounded-tr-lg';
          border = 'border-t border-b border-r';
        } else if (index === len - 2) {
          border = 'border-b border-r border-l';
          rounding = 'rounded-bl-lg';
        } else if (index === len - 1) {
          border = 'border-b border-r';
          rounding = 'rounded-br-lg';
        } else if (index % 2 === 0) {
          border = 'border-l border-r border-b';
        } else if (index % 2 === 1) {
          border = 'border-r border-b';
        }

        return (
          <div
            className={`flex justify-between ${border} ${rounding} border-umbra  px-3 py-4`}
            key={index}
          >
            <p className="text-sm text-stieglitz">{key}</p>
            <p className="text-sm">{statsObject[key]}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Stats;
