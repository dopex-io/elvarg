import { Button } from '@dopex-io/ui';

interface Props {
  hasEarned: boolean;
  hasLeftoverShares: boolean;
  buttonStates: { label: string; handler: () => void }[];
}

const GridButtons = (props: Props) => {
  const { hasEarned = true, hasLeftoverShares, buttonStates } = props;
  return (
    <div className="flex w-full p-3 space-x-2">
      {hasEarned ? (
        <>
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
        </>
      ) : null}
    </div>
  );
};

export default GridButtons;
