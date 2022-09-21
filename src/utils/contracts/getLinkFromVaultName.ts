export default function getLinkFromVaultName(vaultName: string): string {
  if (
    vaultName.includes('V3') &&
    !vaultName.includes('V3 2') &&
    !vaultName.includes('V3 3')
  ) {
    return `https://ssov-epoch-6.dopex.io/ssov/${vaultName.replaceAll(
      ' ',
      '-'
    )}`;
  } else if (vaultName.includes('V3'))
    return `/${vaultName.replaceAll(' ', '-')}`;

  return `#`;
}
