interface Props {
  label: string;
  value: React.ReactNode;
}

const InfoRow = ({ label, value }: Props) => {
  return (
    <div className="flex justify-between">
      <p className="text-stieglitz text-sm">{label}</p>
      <span className="my-auto">{value}</span>
    </div>
  );
};

export default InfoRow;
