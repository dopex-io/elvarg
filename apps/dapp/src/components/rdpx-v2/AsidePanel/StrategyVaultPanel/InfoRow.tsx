import Typography2 from 'components/UI/Typography2';

interface Props {
  label: string;
  value: React.ReactNode;
}

const InfoRow = ({ label, value }: Props) => {
  return (
    <div className="flex justify-between">
      <Typography2 variant="caption" color="stieglitz">
        {label}
      </Typography2>
      {value}
    </div>
  );
};

export default InfoRow;
