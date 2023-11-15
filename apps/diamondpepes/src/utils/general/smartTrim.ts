export default function smartTrim(string: string, maxLength: number): string {
  if (!string) return string;
  if (maxLength < 1) return string;
  if (string.length <= maxLength) return string;
  if (maxLength === 1) return string.substring(0, 1) + '...';
  let midpoint = Math.ceil(string.length / 2);
  let toremove = string.length - maxLength;
  let lstrip = Math.ceil(toremove / 2);
  let rstrip = toremove - lstrip;
  return (
    string.substring(0, midpoint - lstrip) +
    '...' +
    string.substring(midpoint + rstrip)
  );
}
