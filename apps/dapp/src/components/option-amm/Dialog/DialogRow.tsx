interface Props {
  label: string;
  content: string | React.ReactNode;
}

const DialogRow = (props: Props) => {
  const { label, content } = props;

  return (
    <div className="flex justify-between text-xs p-3">
      <p className="text-stieglitz">{label}</p>
      <p>{content}</p>
    </div>
  );
};

export default DialogRow;
