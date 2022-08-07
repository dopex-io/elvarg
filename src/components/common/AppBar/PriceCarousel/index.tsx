import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import PriceTag from 'components/common/AppBar/PriceTag';

interface IPriceCarouselProps {
  tokenPrices: {
    price: number;
    name: string;
    change24h: number;
  }[];
}

const EXCLUDE_TOKENS = ['2CRV', 'USDT', 'USDC', 'FRAX', 'MIM', 'DAI', 'WETH'];

interface IPriceFeedProps extends IPriceCarouselProps {
  animationPlayState: 'paused' | 'running';
}

const StyledPriceFeedWrapper = styled(Box)`
  animation-play-state: ${(props: {
    animationPlayState: 'paused' | 'running';
  }) => props.animationPlayState} !important;

  flex: 1;
  animation: move 60s linear infinite;

  @keyframes move {
    from {
      transform: translateX(0%);
    }

    to {
      transform: translateX(-100%);
    }
  }
`;

const PriceFeed = ({ tokenPrices, animationPlayState }: IPriceFeedProps) => (
  <StyledPriceFeedWrapper
    className="space-x-2 hidden lg:flex"
    animationPlayState={animationPlayState}
  >
    {tokenPrices.map((item, i) => (
      <PriceTag
        key={i}
        asset={item.name}
        price={item.price}
        change={item.change24h}
        showDivisor={i > 0}
      />
    ))}
  </StyledPriceFeedWrapper>
);

const PriceCarousel = ({ tokenPrices }: IPriceCarouselProps) => {
  const [paused, setPaused] = useState(false);

  const handleHover = () => {
    setPaused((prev) => !prev);
  };

  const _tokenPrices = useMemo(() => {
    return tokenPrices.filter((token) => !EXCLUDE_TOKENS.includes(token.name));
  }, [tokenPrices]);

  return (
    <Box
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
      className={'flex bg-umbra z-50'}
    >
      {[0, 1, 2].map((i) => {
        return (
          <PriceFeed
            key={i}
            tokenPrices={_tokenPrices}
            animationPlayState={paused ? 'paused' : 'running'}
          />
        );
      })}
    </Box>
  );
};

export default PriceCarousel;
