import { BigNumber, ethers } from 'ethers';

const getBlockTime = async (provider: ethers.providers.Provider) => {
  const blockNumber = await provider.getBlockNumber();
  const block = await provider.getBlock(blockNumber);
  return BigNumber.from(block.timestamp);
};

export default getBlockTime;
