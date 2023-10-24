import { Button } from '@dopex-io/ui';

interface Props {
  onClick: () => void;
  active: boolean;
  label: string;
}

const TitleItem = (props: Props) => {
  const { label, active, onClick } = props;

  return (
    <Button
      size="small"
      onClick={onClick}
      color={active ? 'carbon' : 'umbra'}
      className="w-1/3"
    >
      <p className={`text-xs ${active ? 'text-white' : 'text-stieglitz'}`}>
        {label}
      </p>
    </Button>
  );
};

export default TitleItem;
