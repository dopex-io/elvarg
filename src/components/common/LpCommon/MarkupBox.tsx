import DiscountMarkupBox from './DiscountMarkupBox';

interface Props {
  rawAmount: string;
  setRawAmount: Function;
}

const MarkupBox = ({ rawAmount, setRawAmount }: Props) => {
  return (
    <DiscountMarkupBox
      data={'Markup'}
      dataToolTip={`A 10% markup means you are willing to sell the option token at 
      its option value calculated using 110% of its implied volatility during purchase`}
      rawAmount={rawAmount}
      setRawAmount={setRawAmount}
      dataText={'Markup must be a whole number between 0% and 100% exclusive'}
    />
  );
};

export default MarkupBox;
