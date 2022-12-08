import UserPositions from 'components/atlantics/Manage/Strategies/InsuredPerps/UserPositions';

const Positions = ({
  active,
}: {
  active: string;
  setTriggerMarker: Function;
}) => {
  return active === 'Insured Positions' || active === 'Orders' ? (
    <UserPositions />
  ) : null;
};

export default Positions;
