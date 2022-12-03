import format from 'date-fns/format';
import { BigNumber } from 'ethers';
import { DATE_FORMAT } from 'constants/index';

function getReadableTime(data: BigNumber): string {
  try {
    return format(new Date(data?.toNumber() * 1000), DATE_FORMAT);
  } catch (error) {
    return 'date error';
  }
}

export default getReadableTime;
