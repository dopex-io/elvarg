import format from 'date-fns/format';
import { BigNumber } from 'ethers';
import { DATE_FORMAT } from 'constants/index';

function getReadableTime(data: BigNumber): string {
  return format(new Date(data.toNumber() * 1000), DATE_FORMAT);
}

export default getReadableTime;
