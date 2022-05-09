import Box from '@mui/material/Box';
import cx from 'classnames';
import { useMemo, useState } from 'react';

import PriceTag from 'components/AppBar/PriceTag';
import styles from 'components/AppBar/styles.module.scss';

interface IPriceCarouselProps {
  tokenPrices: {
    price: number;
    name: string;
    change24h: number;
  }[];
}

interface IPriceFeedProps {
  tokenPrices: {
    price: number;
    name: string;
    change24h: number;
  }[];
  stylesClassName: string;
  style: any;
}

const PriceFeed = ({
  tokenPrices,
  stylesClassName,
  style,
}: IPriceFeedProps) => (
  <Box
    className={cx('space-x-2 hidden lg:flex ', stylesClassName)}
    style={style}
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
  </Box>
);

const PriceCasourel = ({ tokenPrices }: IPriceCarouselProps) => {
  const [paused, setpaused] = useState(false);
  const handleHover = () => {
    setpaused((prev) => !prev);
  };
  const style = useMemo(() => {
    return {
      animationPlayState: paused ? 'paused' : 'running',
    };
  }, [paused]);

  return (
    <Box
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
      className={'flex bg-umbra z-50'}
    >
      <PriceFeed
        tokenPrices={tokenPrices}
        stylesClassName={styles.priceFeed}
        style={style}
      />
      <PriceFeed
        tokenPrices={tokenPrices}
        stylesClassName={styles.priceFeed}
        style={style}
      />
      <PriceFeed
        tokenPrices={tokenPrices}
        stylesClassName={styles.priceFeed}
        style={style}
      />
    </Box>
  );
};

export default PriceCasourel;
