import { useContext, useMemo } from 'react';
import cx from 'classnames';
import { Column } from 'react-table';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import MuiTableCell, {
  TableCellProps as MuiTableCellProps,
} from '@material-ui/core/TableCell';
import Box from '@material-ui/core/Box';

import CustomButton from 'components/UI/CustomButton';

import { OptionsContext, OptionTypeEnum } from 'contexts/Options';

import formatAmount from 'utils/general/formatAmount';

import { GREEK_SYMBOLS } from 'constants/index';

import styles from './styles.module.scss';

const TableCell = ({ className, ...props }: MuiTableCellProps) => {
  return (
    <MuiTableCell
      className={cx(
        className,
        styles.columnPaddingX,
        'text-white border-umbra'
      )}
      {...props}
    />
  );
};

const HeaderCell = ({ className, ...props }: MuiTableCellProps) => {
  return (
    <MuiTableCell
      className={cx(
        className,
        styles.columnPaddingX,
        'text-white border-umbra border-t py-2'
      )}
      {...props}
    />
  );
};

export const greekColumns = {
  delta: ['callDelta', 'putDelta'],
  theta: ['callTheta', 'putTheta'],
  gamma: ['callGamma', 'putGamma'],
  vega: ['callVega', 'putVega'],
};

const columns: Column[] = [
  {
    Header: ({ headerProps }) => (
      <HeaderCell
        align="left"
        className={styles.leftMostColumn}
        {...headerProps}
      >
        CALLS
      </HeaderCell>
    ),
    Cell: ({
      value,
      cell,
      setSelectedOptionData,
      scrollToPurchasePanel,
      isCallItm,
      cellProps,
    }) => {
      const {
        row: { values },
      } = cell;

      const handleClick = () => {
        setSelectedOptionData({
          strikePrice: values.strikePrice,
          optionPrice: values.callOptionPrice,
          optionType: OptionTypeEnum.Call,
          breakEven: values.callBreakEven,
        });
        scrollToPurchasePanel();
      };

      return (
        <TableCell
          align="left"
          className={cx(isCallItm ? 'bg-umbra' : '', styles.leftMostColumn)}
          {...cellProps}
        >
          <CustomButton size="medium" className="w-28" onClick={handleClick}>
            ${formatAmount(value, 2)} +
          </CustomButton>
        </TableCell>
      );
    },
    accessor: 'callOptionPrice',
  },
  {
    Header: ({ headerProps }) => (
      <HeaderCell align="left" className="text-stieglitz" {...headerProps}>
        B/E
      </HeaderCell>
    ),
    Cell: ({ value, isCallItm, cellProps }) => (
      <TableCell
        align="left"
        className={isCallItm ? 'bg-umbra' : ''}
        {...cellProps}
      >
        ${formatAmount(value, 2)}
      </TableCell>
    ),
    accessor: 'callBreakEven',
  },
  {
    Header: ({ headerProps }) => (
      <HeaderCell align="left" className="text-stieglitz" {...headerProps}>
        {GREEK_SYMBOLS.vega}
      </HeaderCell>
    ),
    Cell: ({ value, isCallItm, cellProps }) => (
      <TableCell
        align="left"
        className={isCallItm ? 'bg-umbra' : ''}
        {...cellProps}
      >
        {formatAmount(value, 2)}
      </TableCell>
    ),
    accessor: 'callVega',
  },
  {
    Header: ({ headerProps }) => (
      <HeaderCell align="left" className="text-stieglitz" {...headerProps}>
        {GREEK_SYMBOLS.gamma}
      </HeaderCell>
    ),
    Cell: ({ value, isCallItm, cellProps }) => (
      <TableCell
        align="left"
        className={isCallItm ? 'bg-umbra' : ''}
        {...cellProps}
      >
        {formatAmount(value, 2)}
      </TableCell>
    ),
    accessor: 'callGamma',
  },
  {
    Header: ({ headerProps }) => (
      <HeaderCell align="left" className="text-stieglitz" {...headerProps}>
        {GREEK_SYMBOLS.theta}
      </HeaderCell>
    ),
    Cell: ({ value, isCallItm, cellProps }) => (
      <TableCell
        align="left"
        {...cellProps}
        className={isCallItm ? 'bg-umbra' : ''}
      >
        {formatAmount(value, 2)}
      </TableCell>
    ),
    accessor: 'callTheta',
  },
  {
    Header: ({ headerProps }) => (
      <HeaderCell align="left" className="text-stieglitz" {...headerProps}>
        {GREEK_SYMBOLS.delta}
      </HeaderCell>
    ),
    Cell: ({ value, isCallItm, cellProps }) => (
      <TableCell
        align="left"
        className={isCallItm ? 'bg-umbra' : ''}
        {...cellProps}
      >
        {formatAmount(value, 2)}
      </TableCell>
    ),
    accessor: 'callDelta',
  },
  {
    Header: ({ headerProps }) => (
      <HeaderCell align="left" className="text-stieglitz" {...headerProps}>
        IV
      </HeaderCell>
    ),
    Cell: ({ value, isCallItm, cellProps }) => (
      <TableCell
        align="left"
        className={isCallItm ? 'bg-umbra' : ''}
        {...cellProps}
      >
        {formatAmount(value, 2)}
      </TableCell>
    ),
    accessor: 'callIv',
  },
  {
    Header: ({ headerProps }) => {
      const { optionData, setOptionData } = useContext(OptionsContext);
      const isAsc: boolean = useMemo(
        () =>
          optionData.length > 1 &&
          optionData[0].strikePrice - optionData[1].strikePrice < 0,
        [optionData]
      );

      return (
        <HeaderCell
          align="center"
          sortDirection={isAsc ? 'asc' : 'desc'}
          {...headerProps}
        >
          <TableSortLabel
            active={true}
            direction={isAsc ? 'asc' : 'desc'}
            onClick={() =>
              setOptionData((prevState) => {
                if (
                  prevState.length > 1 &&
                  prevState[0].strikePrice - prevState[1].strikePrice < 0
                ) {
                  return [...prevState].sort(
                    (a, b) => b.strikePrice - a.strikePrice
                  );
                } else {
                  return [...prevState].sort(
                    (a, b) => a.strikePrice - b.strikePrice
                  );
                }
              })
            }
          >
            <span className="text-white whitespace-nowrap">Strike</span>
          </TableSortLabel>
        </HeaderCell>
      );
    },
    Cell: ({ value, cellProps }) => (
      <TableCell align="center" {...cellProps}>
        <Box className="text-wave-blue">${value}</Box>
      </TableCell>
    ),
    accessor: 'strikePrice',
  },
  {
    Header: ({ headerProps }) => (
      <HeaderCell align="right" className="text-stieglitz" {...headerProps}>
        IV
      </HeaderCell>
    ),
    Cell: ({ value, isPutItm, cellProps }) => (
      <TableCell
        align="right"
        className={isPutItm ? 'bg-umbra' : ''}
        {...cellProps}
      >
        {formatAmount(value, 2)}
      </TableCell>
    ),
    accessor: 'putIv',
  },
  {
    Header: ({ headerProps }) => (
      <HeaderCell align="right" className="text-stieglitz" {...headerProps}>
        {GREEK_SYMBOLS.delta}
      </HeaderCell>
    ),
    Cell: ({ value, isPutItm, cellProps }) => (
      <TableCell
        align="right"
        className={isPutItm ? 'bg-umbra' : ''}
        {...cellProps}
      >
        {formatAmount(value, 2)}
      </TableCell>
    ),
    accessor: 'putDelta',
  },
  {
    Header: ({ headerProps }) => (
      <HeaderCell align="right" className="text-stieglitz" {...headerProps}>
        {GREEK_SYMBOLS.theta}
      </HeaderCell>
    ),
    Cell: ({ value, isPutItm, cellProps }) => (
      <TableCell
        align="right"
        className={isPutItm ? 'bg-umbra' : ''}
        {...cellProps}
      >
        {formatAmount(value, 2)}
      </TableCell>
    ),
    accessor: 'putTheta',
  },
  {
    Header: ({ headerProps }) => (
      <HeaderCell align="right" className="text-stieglitz" {...headerProps}>
        {GREEK_SYMBOLS.gamma}
      </HeaderCell>
    ),
    Cell: ({ value, isPutItm, cellProps }) => (
      <TableCell
        align="right"
        className={isPutItm ? 'bg-umbra' : ''}
        {...cellProps}
      >
        {formatAmount(value, 2)}
      </TableCell>
    ),
    accessor: 'putGamma',
  },
  {
    Header: ({ headerProps }) => (
      <HeaderCell align="right" className="text-stieglitz" {...headerProps}>
        {GREEK_SYMBOLS.vega}
      </HeaderCell>
    ),
    Cell: ({ value, isPutItm, cellProps }) => (
      <TableCell
        align="right"
        className={isPutItm ? 'bg-umbra' : ''}
        {...cellProps}
      >
        {formatAmount(value, 2)}
      </TableCell>
    ),
    accessor: 'putVega',
  },
  {
    Header: ({ headerProps }) => (
      <HeaderCell align="right" className="text-stieglitz" {...headerProps}>
        B/E
      </HeaderCell>
    ),
    Cell: ({ value, isPutItm, cellProps }) => (
      <TableCell
        align="right"
        className={isPutItm ? 'bg-umbra' : ''}
        {...cellProps}
      >
        ${formatAmount(value, 2)}
      </TableCell>
    ),
    accessor: 'putBreakEven',
  },
  {
    Header: ({ headerProps }) => (
      <HeaderCell
        align="right"
        className={styles.rightMostColumn}
        {...headerProps}
      >
        PUTS
      </HeaderCell>
    ),
    Cell: ({
      value,
      cell,
      isPutItm,
      setSelectedOptionData,
      scrollToPurchasePanel,
      cellProps,
    }) => {
      const {
        row: { values },
      } = cell;

      const handleClick = () => {
        setSelectedOptionData({
          strikePrice: values.strikePrice,
          optionPrice: values.putOptionPrice,
          optionType: OptionTypeEnum.Put,
          breakEven: values.putBreakEven,
        });
        scrollToPurchasePanel();
      };

      return (
        <TableCell
          align="right"
          className={cx(isPutItm ? 'bg-umbra' : '', styles.rightMostColumn)}
          {...cellProps}
        >
          <CustomButton
            size="medium"
            className="w-28"
            color="down-bad"
            onClick={handleClick}
          >
            ${formatAmount(value, 2)} +
          </CustomButton>
        </TableCell>
      );
    },
    accessor: 'putOptionPrice',
  },
];

export default columns;

export const makeData = (data) => {
  return data.map((item) => {
    return {
      callOptionPrice: item.callOptionPrice,
      callBreakEven: item.callBreakEven,
      callVega: item.callGreeks.vega,
      callGamma: item.callGreeks.gamma,
      callTheta: item.callGreeks.theta,
      callDelta: item.callGreeks.delta,
      callIv: item.callIv,
      strikePrice: item.strikePrice,
      putIv: item.putIv,
      putDelta: item.putGreeks.delta,
      putTheta: item.putGreeks.theta,
      putGamma: item.putGreeks.gamma,
      putVega: item.putGreeks.vega,
      putBreakEven: item.putBreakEven,
      putOptionPrice: item.putOptionPrice,
    };
  });
};
