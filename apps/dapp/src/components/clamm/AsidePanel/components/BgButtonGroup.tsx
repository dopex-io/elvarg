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
    <div className="flex justify-between bg-carbon border border-carbon rounded-md w-full">
      {labels.map((label, i: number) => (
        <div
          key={i}
          role="button"
          className={`p-2 text-sm flex-row flex items-center justify-center border-0 hover:border-0 w-full m-1 transition ease-in-out duration-500 rounded-md ${
            active === i ? 'bg-umbra' : 'bg-carbon'
          }`}
          onClick={() => handleClick(i)}
        >
          <span className="hover:stieglitz">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default BgButtonGroup;
