import cx from 'classnames';

import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

import styles from './styles.module.scss';

const SelectStrikeWidget = () => {
  return (
    <Box
      className={cx(
        'bg-cod-gray sm:px-4 px-2 py-4 rounded-xl pt-4 text-center',
        styles['cardWidth']
      )}
    >
      <img
        src="/assets/buy-example.svg"
        className="w-24 h-14 mt-10 mx-auto"
        alt="Buy"
      />
      <Typography variant="h5" className="mt-7">
        Start by selecting a strike price
      </Typography>
      <Typography variant="h6" className="text-stieglitz mt-3 mb-7">
        Use the table to the left or options below to generate an order{' '}
      </Typography>
    </Box>
  );
};

export default SelectStrikeWidget;
