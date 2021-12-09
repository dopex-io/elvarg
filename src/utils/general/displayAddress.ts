import smartTrim from 'utils/general/smartTrim';

export default function displayAddress(
  accountAddress: string,
  ensName: string
): string {
  return !ensName ? smartTrim(accountAddress, 10) : ensName;
}
