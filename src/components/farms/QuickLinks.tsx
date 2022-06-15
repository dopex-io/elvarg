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
    <>
      <Box className="mb-4 text-stieglitz">Quick Links</Box>
      <Box className="flex flex-col space-y-2">
        <QuickLink
          text="Buy DPX"
          href="https://app.sushi.com/swap?chainId=42161&inputCurrency=ETH&outputCurrency=0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55"
        />
        <QuickLink
          text="Buy RDPX"
          href="https://app.sushi.com/swap?chainId=42161&inputCurrency=ETH&outputCurrency=0x32Eb7902D4134bf98A28b963D26de779AF92A212"
        />
        <QuickLink
          text="Add DPX-WETH Liquidity"
          href="https://app.sushi.com/add/ETH/0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55?tokens=ETH&tokens=0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55&chainId=42161"
        />
        <QuickLink
          text="Buy RDPX-WETH Liquidity"
          href="https://app.sushi.com/add/ETH/0x32Eb7902D4134bf98A28b963D26de779AF92A212?tokens=ETH&tokens=0x32Eb7902D4134bf98A28b963D26de779AF92A212&chainId=42161"
        />
      </Box>
    </>
  );
};

export default QuickLinks;
