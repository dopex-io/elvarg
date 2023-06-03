interface Props {
  label: string;
  value: string;
  symbol: string;
  symbolPrefixed?: boolean;
}

const TitleItem = (props: Props) => {
  const { label, value, symbolPrefixed = false, symbol } = props;

  return (
    <div className="flex flex-col">
      <span
        className={`text-sm text-white flex ${
          !symbolPrefixed ? 'flex-row-reverse' : null
        }`}
      >
        <p className="text-stieglitz inline text-sm">{symbol}</p>
        {value}
      </span>
      <span className="text-sm text-stieglitz">{label}</span>
    </div>
  );
};

export default TitleItem;
