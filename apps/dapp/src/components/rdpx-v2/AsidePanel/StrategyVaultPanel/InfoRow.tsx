import Typography2 from 'components/UI/Typography2';

interface Props {
  label: string;
  value: React.ReactNode;
}

const InfoRow = ({ label, value }: Props) => {
  return (
    <div className="flex justify-between">
      <Typography2 variant="caption" color="stieglitz" className="my-auto">
        {label}
      </Typography2>
      <Typography2 variant="caption">{value}</Typography2>
    </div>
  );
};

export default InfoRow;
