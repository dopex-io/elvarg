interface Props {
  buttons: {
    handleClick: (e: any) => void;
    textContent: string;
    disabled?: boolean;
    value: any;
  }[];
  active: string;
}

const Pill = ({ buttons, active }: Props) => {
  return (
    <div className="bg-mineshaft rounded-md p-1 relative flex text-xs">
      {buttons.map((button, i) => (
        <div className="relative w-fit rounded-sm p-1" key={i}>
          <div
            className={`rounded-[4px] top-0 absolute transform h-full w-full ${
              active === button.value
                ? 'translate-x-0 bg-black left-0 bg-opacity-30'
                : 'translate-x-full right-0 bg-opacity-0'
            } duration-500`}
          />
          <button
            onClick={button.handleClick}
            className={`px-1 rounded-sm ${
              button.disabled ? 'text-stieglitz cursor-not-allowed' : null
            }`}
            disabled={button.disabled}
            value={button.value}
          >
            {button.textContent}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Pill;
