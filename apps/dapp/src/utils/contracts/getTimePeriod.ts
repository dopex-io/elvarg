import { utils as ethersUtils } from 'ethers';

function getTimePeriod(timePeriod: 'weekly' | 'monthly'): string {
  return ethersUtils.solidityKeccak256(['string'], [timePeriod]);
}

export default getTimePeriod;
