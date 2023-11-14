import { Button } from '@dopex-io/ui';

interface Props {
  hasLeftoverShares: boolean;
  buttonStates: { label: string; handler: () => void }[];
}

const GridButtons = (props: Props) => {
  const { hasLeftoverShares, buttonStates } = props;
  return (
    <div className="flex w-full p-3 space-x-2">
      <Button
        color="mineshaft"
        className="w-1/2"
        onClick={buttonStates[0].handler}
      >
        {buttonStates[0].label}
      </Button>
      <Button
        color="mineshaft"
        className="w-1/2"
        onClick={buttonStates[1].handler}
      >
        {buttonStates[1].label}
      </Button>
      {hasLeftoverShares ? (
        <Button
          color="mineshaft"
          className="w-1/2"
          onClick={buttonStates[2].handler}
        >
          {buttonStates[2].label}
        </Button>
      ) : null}
    </div>
  );
};

export default GridButtons;
