const isNativeSsov = (asset: string) => {
  return ['ETH', 'AVAX'].includes(asset);
};

export default isNativeSsov;
