export const getUpperLowerStep = (currentPrice: number) => {
  if (currentPrice === 0) {
    return [0, 0, 0];
  }
  const roundPrice = Math.round(currentPrice);
  const placeValue = Math.floor(Math.log10(roundPrice));
  if (placeValue <= 2) {
    const nearestValidPrice =
      roundPrice % 5 === 0 ? roundPrice : Math.round(roundPrice / 10) * 10;
    return [nearestValidPrice, Math.max(5, nearestValidPrice - 50), 5];
  }

  const factor = Math.pow(10, placeValue - 2);
  const nearestValidPrice =
    roundPrice % factor === 0
      ? roundPrice
      : Math.round(roundPrice / (factor * 10)) * (factor * 10);
  return [nearestValidPrice, nearestValidPrice - factor * 50, factor * 5];
};

export const getNearestValidPrice = (currentPrice: number) => {
  if (currentPrice === 0) {
    return 0;
  }
  const roundPrice = Math.round(currentPrice);
  const placeValue = Math.floor(Math.log10(roundPrice));
  if (placeValue <= 2) {
    return roundPrice % 5 === 0 ? roundPrice : Math.round(roundPrice / 10) * 10;
  }

  const factor = Math.pow(10, placeValue - 2);
  return roundPrice % factor === 0
    ? roundPrice
    : Math.round(roundPrice / (factor * 10)) * (factor * 10);
};
