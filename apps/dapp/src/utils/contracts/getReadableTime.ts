import { BigNumber } from 'ethers';

import format from 'date-fns/format';

const DATE_FORMAT: string = 'd LLL yy';

function getReadableTime(data: BigNumber | number): string {
  try {
    const numberData = data instanceof BigNumber ? data?.toNumber() : data;
    return format(new Date(numberData * 1000), DATE_FORMAT);
  } catch (error) {
    return 'date error';
  }
}

export default getReadableTime;
