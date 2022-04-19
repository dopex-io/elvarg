import { useCallback, useContext } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import cx from 'classnames';

import { PoolsContext } from 'contexts/Pools';

import { TimePeriodEnum } from 'types';

const buttonStyle: string =
  'rounded-md h-10 ml-1 text-white hover:bg-opacity-70';
const isSelected: string = 'bg-primary hover:bg-primary';
const isNotSelected: string = 'bg-cod-gray hover:bg-cod-gray';

function TimePeriodSelector({ className }: { className?: string }) {
  const { timePeriod, setTimePeriod } = useContext(PoolsContext);

  const onWeeklyClick = useCallback(
    () => setTimePeriod(TimePeriodEnum.Week),
    [setTimePeriod]
  );

  const onMonthlyClick = useCallback(
    () => setTimePeriod(TimePeriodEnum.Month),
    [setTimePeriod]
  );

  return (
    <Box className={cx('flex', className)}>
      <Button
        className={cx(
          buttonStyle,
          timePeriod === TimePeriodEnum.Week ? isSelected : isNotSelected
        )}
        onClick={onWeeklyClick}
      >
        Weekly
      </Button>
      <Button
        className={cx(
          buttonStyle,
          timePeriod === TimePeriodEnum.Month ? isSelected : isNotSelected
        )}
        onClick={onMonthlyClick}
      >
        Monthly
      </Button>
    </Box>
  );
}

export default TimePeriodSelector;
