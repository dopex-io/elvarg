import cx from 'classnames';
import Box from '@mui/material/Box';

import getValueColorClass from 'utils/general/getValueColorClass';
import formatAmount from 'utils/general/formatAmount';

interface Props {
  asset: string;
  price: number;
  change: number;
  className?: string;
  showDivisor?: boolean;
}

const PriceTag = (props: Props) => {
  const { asset, price, change, className, showDivisor } = props;

  return (
    <Box className={'flex'}>
      {showDivisor ? (
        <img
          src="/assets/threedots-black.svg"
          className={'mt-2.5 mb-2.5 mr-2'}
          alt={'Divisor'}
        />
      ) : null}
      <Box className={cx('flex space-x-2 p-2 rounded-md', className)}>
        <span className="text-white text-xs">{asset}</span>
        <span className="text-stieglitz text-xs">
          ${formatAmount(price, 2)}
        </span>
        <span className={`${getValueColorClass(change)} text-xs`}>
          {change.toFixed(1)}%
        </span>
      </Box>
    </Box>
  );
};

export default PriceTag;
