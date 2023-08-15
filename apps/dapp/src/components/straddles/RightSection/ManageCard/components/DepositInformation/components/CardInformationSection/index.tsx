import { Switch } from '@dopex-io/ui';

type CardInformationSectionProps = {
  depositAmount: string;
  setCompound: Function;
  setRollover: Function;
  // expiry:
};

const CardInformationSection = (props: CardInformationSectionProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between">
        <span>Compound</span>
        <Switch />
      </div>
      <div className="flex justify-between">
        <span>Compound</span>
        <Switch />
      </div>
      <div className="flex justify-between">
        <span>Compound</span>
        <Switch />
      </div>
      <div className="flex justify-between">
        <span>Compound</span>
        <Switch />
      </div>
    </div>
  );
};

export default CardInformationSection;
