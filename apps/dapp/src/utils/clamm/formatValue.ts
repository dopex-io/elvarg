import { formatUnits, parseUnits } from 'viem';

function formatValue<T extends number | string | bigint>(
  value: T,
  decimals: number = 0,
) {
  if (typeof value == 'bigint') {
    if (value === 0n) return '0';
    const lowestThreshold = parseUnits('0.00000000001', decimals);
    if (value < lowestThreshold) return '0';
    const requiredPrecision = value < parseUnits('0.001', decimals) ? 10 : 5;
    const formatted = formatUnits(value, decimals);
    return formatted.substring(0, requiredPrecision);
  } else if (typeof value === 'string') {
    const lowestThreshold = 0.0000000001;
    if (parseFloat(value) < lowestThreshold) return '0';
    const requiredPrecision = parseFloat(value) < 0.001 ? 10 : 5;
    return value.substring(0, requiredPrecision);
  } else if (typeof value === 'number') {
    const lowestThreshold = 0.0000000001;
    if (value < lowestThreshold) return '0';
    return value < 0.001 ? value.toFixed(10) : value.toFixed(5);
  } else {
    return String(value);
  }
}

export default formatValue;
