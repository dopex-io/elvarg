import cx from 'classnames';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import getValueColorClass from 'utils/general/getValueColorClass';

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
        <Typography variant="caption" component="span" className="text-white">
          {asset}
        </Typography>
        <Typography
          variant="caption"
          component="span"
          className="text-stieglitz"
        >
          ${price}
        </Typography>
        <Typography
          variant="caption"
          component="span"
          className={getValueColorClass(change)}
        >
          {change.toFixed(1)}%
        </Typography>
      </Box>
    </Box>
  );
};

export default PriceTag;
