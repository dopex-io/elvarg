interface Props {
  label: string;
  content?: React.ReactNode | string;
}

const RowItem = (props: Props) => {
  const { label, content } = props;
  return (
    <div className="flex justify-between text-xs">
      <p className="text-stieglitz">{label}</p>
      {content}
    </div>
  );
};

export default RowItem;
