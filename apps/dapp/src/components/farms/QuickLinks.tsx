import QuickLink from 'components/common/QuickLink';

const QuickLinks = () => {
  return (
    <div className="lg:fixed lg:bottom-6 mx-4 w-80">
      <div className="mb-4 text-stieglitz">Quick Links</div>
      <div className="flex flex-col space-y-2">
        <QuickLink
          text="Buy DPX on Bybit"
          href="https://www.bybit.com/en-US/trade/spot/DPX/USDT?affiliate_id=50505"
        />
        <QuickLink
          text="Buy DPX or rDPX on Camelot"
          href="https://app.camelot.exchange/"
        />
        <QuickLink
          text="Add DPX/ETH Liquidity"
          href="https://app.camelot.exchange/liquidity"
        />
      </div>
    </div>
  );
};

export default QuickLinks;
