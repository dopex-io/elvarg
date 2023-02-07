const getSrcFromAssetName = (assetName: string) => {
  const srcs: { [key: string]: string } = {
    DuelDiamondPepesNFT: '/images/nfts/DiamondPepes.gif',
    DiamondPepesNFT: '/images/nfts/DiamondPepes.gif',
    DopexSantasNFT: '/images/nfts/DopexSantasNFT.gif',
    DopexBridgoorNFT: '/images/nfts/DopexBridgoorNFT.gif',
    DopexHalloweenNFT: '/images/nfts/DopexHalloweenNFT.gif',
  };

  return (
    srcs[assetName] || '/images/tokens/' + assetName.toLowerCase() + '.svg'
  );
};

export default getSrcFromAssetName;
