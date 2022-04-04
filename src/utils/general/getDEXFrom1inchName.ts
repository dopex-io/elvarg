const getDEXFrom1InchName = (name) => {
  const parser = {
    ARBITRUM_UNISWAP_V3: {
      name: 'Uniswap V3',
      picture: 'uniswap.svg',
    },
    ARBITRUM_BALANCER_V2: {
      name: 'Balancer V2',
      picture: 'balancer.svg',
    },
    ARBITRUM_SUSHISWAP: {
      name: 'Sushiswap',
      picture: 'sushiswap.svg',
    },
    ARBITRUM_CURVE: {
      name: 'Curve',
      picture: 'curve.svg',
    },
    ARBITRUM_DODO: {
      name: 'DODO',
      picture: 'dodo.svg',
    },
    TRADERJOE: {
      name: 'Trader JOE',
      picture: 'traderjoe.svg',
    },
    PANGOLIN: {
      name: 'Pangolin',
      picture: 'pangolin.svg',
    },
    WAULTSWAP: {
      name: 'Wault Swap',
      picture: 'wault.svg',
    },
  };
  return parser[name] || { name: name, picture: 'unknown.svg' };
};

export default getDEXFrom1InchName;
