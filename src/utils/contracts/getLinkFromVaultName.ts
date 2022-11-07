export default function getLinkFromVaultName(vaultName: string): string {
  if (vaultName.includes('V3 2') || vaultName.includes('V3 3'))
    return `/ssov-v3/${vaultName.replaceAll(' ', '-')}`;

  return `#`;
}
