import { Button } from '@dopex-io/ui';

interface Props {
  onClick: () => void;
  active: boolean;
  label: string;
  disabled: boolean;
}

const TitleItem = (props: Props) => {
  const { label, active, onClick, disabled } = props;

  return (
    <Button
      size="small"
      onClick={onClick}
      color={active ? 'carbon' : 'umbra'}
      disabled={disabled}
      className={`w-1/3 ${disabled ? 'cursor-not-allowed' : 'cursor-default'}`}
    >
      <p className={`text-xs ${active ? 'text-white' : 'text-stieglitz'}`}>
        {label}
      </p>
    </Button>
  );
};

export default TitleItem;
