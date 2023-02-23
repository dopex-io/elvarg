import { BaseNFT } from '@dopex-io/sdk';

export default async function getTokenUri(nftContract: BaseNFT) {
  try {
    const uri = await nftContract.tokenURI(0);
    return uri;
  } catch (err) {
    return null;
  }
}
