export default function getAssetFromVaultName(vaultName: string): string {
  const assets = ['ETH', 'rDPX', 'gOHM', 'DPX', 'LUNA', 'CRV', 'BTC', 'GMX'];
  for (let i in assets)
    if (vaultName.includes(String(assets[i])))
      return String(assets[i]).toLowerCase();

  return 'unknown';
}
