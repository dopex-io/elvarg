interface Props {
  label: string;
  value: React.ReactNode;
}

const InfoRow = ({ label, value }: Props) => {
  return (
    <div className="flex justify-between">
      <h6 className="text-stieglitz text-sm">{label}</h6>
      {value}
    </div>
  );
};

export default InfoRow;
