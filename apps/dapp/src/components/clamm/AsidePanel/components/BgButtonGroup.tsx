const BgButtonGroup = ({
  active,
  labels,
  handleClick,
}: {
  active: number;
  labels: (React.ReactNode | string)[];
  handleClick: (i: number) => void;
}) => {
  return (
    <div className="flex justify-between bg-cod-gray border border-umbra rounded-md w-full">
      {labels.map((label, i: number) => (
        <div
          key={i}
          role="button"
          className={`p-2 text-sm flex-row flex items-center justify-center border-0 hover:border-0 w-full m-1 transition ease-in-out duration-500 rounded-md ${
            active === i ? 'bg-umbra' : 'bg-cod-gray'
          }`}
          onClick={() => handleClick(i)}
        >
          <span
            className={`${
              active === i ? 'text-white' : 'text-stieglitz hover:text-white'
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BgButtonGroup;
