import { Button } from '@dopex-io/ui';

import Typography2 from 'components/UI/Typography2';

interface Props {
  onClick: () => void;
  active: boolean;
  label: string;
  disabled?: boolean;
}

const TitleItem = (props: Props) => {
  const { label, active, onClick, disabled = false } = props;

  return (
    <Button
      size="small"
      onClick={onClick}
      color={active ? 'carbon' : 'umbra'}
      disabled={disabled}
      className={`w-full ${disabled ? 'cursor-not-allowed' : null}`}
    >
      <Typography2 variant="caption" color={active ? 'white' : 'stieglitz'}>
        {label}
      </Typography2>
    </Button>
  );
};

export default TitleItem;
