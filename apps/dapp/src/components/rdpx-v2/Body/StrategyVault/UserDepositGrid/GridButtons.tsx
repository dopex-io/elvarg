import { Button } from '@dopex-io/ui';

interface Props {
  buttonStates: { label: string; handler: () => void; disabled?: boolean }[];
}

const GridButtons = (props: Props) => {
  const { buttonStates } = props;
  return (
    <div className="flex w-full p-3 space-x-2">
      {buttonStates.map((state, index) => (
        <Button
          key={index}
          color="primary"
          className={`w-full ${state.disabled ? 'cursor-not-allowed' : null}`}
          onClick={state.handler}
          disabled={state.disabled}
        >
          {state.label}
        </Button>
      ))}
    </div>
  );
};

export default GridButtons;
