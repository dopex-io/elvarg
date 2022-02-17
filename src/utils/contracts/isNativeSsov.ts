const isNativeSsov = (asset) => {
  return ['ETH', 'AVAX'].includes(asset);
};

export default isNativeSsov;
