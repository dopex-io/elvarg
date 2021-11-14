import cx from 'classnames';
import Box from '@material-ui/core/Box';

import Typography from 'components/UI/Typography';
import getValueColorClass from 'utils/general/getValueColorClass';

interface Props {
  asset: string;
  price: number;
  change: number;
  className?: string;
}

const PriceTag = (props: Props) => {
  const { asset, price, change, className } = props;

  return (
    <Box
      className={cx(
        'flex space-x-2 p-2 border border-mineshaft rounded-md',
        className
      )}
    >
      <Typography variant="caption" component="span" className="text-stieglitz">
        {asset}
      </Typography>
      <Typography variant="caption" component="span">
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
  );
};

export default PriceTag;
