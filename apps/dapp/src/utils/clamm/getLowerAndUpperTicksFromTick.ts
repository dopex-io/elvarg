function getLowerAndUpperTicksFromTick(
  tick: number,
  tickSpacing: number,
): {
  tickLower: number;
  tickUpper: number;
} {
  const tickModulo = tick % tickSpacing;
  if (tickModulo === 0) {
    return {
      tickLower: tick - tickSpacing,
      tickUpper: tick,
    };
  } else if ((tickModulo + tick) % tickSpacing === 0) {
    tick += tickModulo;
    return {
      tickLower: tick - tickSpacing,
      tickUpper: tick,
    };
  } else {
    tick -= tickModulo;
    return {
      tickLower: tick - tickSpacing,
      tickUpper: tick,
    };
  }
}

export default getLowerAndUpperTicksFromTick;
