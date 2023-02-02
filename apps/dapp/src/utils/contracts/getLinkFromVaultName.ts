export default function getLinkFromVaultName(vaultName: string): string {
  if (vaultName.includes('V3'))
    return `/ssov-v3/${vaultName.replaceAll(' ', '-')}`;

  return `#`;
}
