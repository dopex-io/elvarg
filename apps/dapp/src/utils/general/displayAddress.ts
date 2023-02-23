import smartTrim from 'utils/general/smartTrim';

export default function displayAddress(
  accountAddress?: string,
  ensName?: string
): string {
  if (!accountAddress) return '';
  return !ensName ? smartTrim(accountAddress, 10) : ensName;
}
