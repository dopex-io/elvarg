import DiscountMarkupBox from 'components/common/LpCommon/DiscountMarkupBox';

interface Props {
  rawAmount: string;
  setRawAmount: Function;
  amount: number;
}

const DiscountBox = ({ rawAmount, setRawAmount, amount }: Props) => {
  return (
    <DiscountMarkupBox
      data={'Discount'}
      dataToolTip={`Discount must be a whole number between 0% and 100%. A 10% discount means you are willing to buy the option token at its option value calculated using 90% of its implied volatility`}
      rawAmount={rawAmount}
      setRawAmount={setRawAmount}
      amount={amount}
    />
  );
};

export default DiscountBox;
