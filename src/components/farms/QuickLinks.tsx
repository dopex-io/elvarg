import Box from '@mui/material/Box';
import LaunchIcon from '@mui/icons-material/Launch';

const QuickLink = ({ text, href }: { text: string; href: string }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Box className="bg-umbra p-3 rounded-md flex justify-between text-xs items-center">
        {text}
        <LaunchIcon className="w-4" />
      </Box>
    </a>
  );
};

const QuickLinks = () => {
  return (
    <Box className="fixed lg:w-80 bottom-6 mx-4">
      <Box className="mb-4 text-stieglitz">Quick Links</Box>
      <Box className="flex flex-col space-y-2">
        <QuickLink text="Buy DPX or rDPX" href="https://www.sushi.com/swap" />
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
