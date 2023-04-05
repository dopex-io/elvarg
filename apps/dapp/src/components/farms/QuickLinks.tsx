import Box from '@mui/material/Box';
import QuickLink from 'components/common/QuickLink';

const QuickLinks = () => {
  return (
    <Box className="lg:fixed lg:bottom-6 mx-4 w-80">
      <Box className="mb-4 text-stieglitz">Quick Links</Box>
      <Box className="flex flex-col space-y-2">
        <QuickLink
          text="Buy DPX on Bybit"
          href="https://www.bybit.com/en-US/trade/spot/DPX/USDT?affiliate_id=50505"
        />
        <QuickLink
          text="Buy DPX or rDPX on Sushiswap"
          href="https://www.sushi.com/swap"
        />
        <QuickLink
          text="Add DPX/ETH Liquidity"
          href="https://www.sushi.com/earn/arb1:0x0c1cf6883efa1b496b01f654e247b9b419873054/add"
        />
        <QuickLink
          text="Add rDPX/ETH Liquidity"
          href="https://www.sushi.com/earn/arb1:0x7418f5a2621e13c05d1efbd71ec922070794b90a/add"
        />
      </Box>
    </Box>
  );
};

export default QuickLinks;
