import DiscountMarkupBox from './DiscountMarkupBox';

interface Props {
  rawAmount: string;
  setRawAmount: Function;
}

const DiscountBox = ({ rawAmount, setRawAmount }: Props) => {
  return (
    <DiscountMarkupBox
      data={'Discount'}
      dataToolTip={`A 10% discount means you are willing to buy the option token at its option value calculated using 90% of its implied volatility`}
      rawAmount={rawAmount}
      setRawAmount={setRawAmount}
      dataText={'Discount must be a whole number between 0% and 100%'}
    />
  );
};

export default DiscountBox;
