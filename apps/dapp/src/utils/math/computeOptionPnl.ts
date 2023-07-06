interface Args {
  strike: number;
  price: number;
  side: 'call' | 'put';
  size?: number;
}

const computeOptionPnl = (args: Args) => {
  const { strike, price, side, size = 1 } = args;

  if (side === 'call') {
    return Math.max((price - strike) * size, 0);
  } else return Math.max((strike - price) * size, 0);
};

export default computeOptionPnl;
