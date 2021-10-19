import cx from 'classnames';
import Box from '@material-ui/core/Box';

import Typography from 'components/UI/Typography';

interface Props {
  asset: string;
  price: number;
  className?: string;
}

const PriceTag = (props: Props) => {
  const { asset, price, className } = props;

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
    </Box>
  );
};

export default PriceTag;
