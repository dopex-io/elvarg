// 𝑉1−𝑉2 / [(𝑉1+𝑉2) / 2] × 100 = percentage difference

const getPercentageDifference = (value1: number, value2: number) => {
  const numerator = value1 - value2;
  const denominator = (value1 + value2) / 2;
  return (numerator / denominator) * 100;
};

export default getPercentageDifference;
