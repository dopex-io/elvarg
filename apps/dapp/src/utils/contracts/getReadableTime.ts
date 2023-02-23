import format from 'date-fns/format';
import { BigNumber } from 'ethers';
import { DATE_FORMAT } from 'constants/index';

function getReadableTime(data: BigNumber | number): string {
  try {
    const numberData = data instanceof BigNumber ? data?.toNumber() : data;
    return format(new Date(numberData * 1000), DATE_FORMAT);
  } catch (error) {
    return 'date error';
  }
}

export default getReadableTime;
