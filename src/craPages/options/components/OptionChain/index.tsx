import { useContext, useMemo, useCallback, useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { useNavigate } from 'react-router-dom';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Skeleton from '@material-ui/lab/Skeleton';

import { OptionsContext } from 'contexts/Options';
import { AssetsContext } from 'contexts/Assets';

import ExpirySelector from './ExpirySelector';
import GreeksFilter from './GreeksFilter';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import columns, { greekColumns, makeData } from './columns';

import useScreenType from 'hooks/useScreenType';

const columnNames = [
  'OptionPrice',
  'BreakEven',
  'Delta',
  'Theta',
  'Gamma',
  'Vega',
  'Iv',
];

const callColumnsToHideOnToggleView = columnNames
  .map((col) => `call${col}`)
  .concat(['BreakEven', 'Theta', 'Gamma', 'Vega'].map((col) => `put${col}`))
  .flat();

const putColumnsToHideOnToggleView = columnNames
  .map((col) => `put${col}`)
  .concat(['BreakEven', 'Theta', 'Gamma', 'Vega'].map((col) => `call${col}`))
  .flat();

const OptionChain = ({ scrollToPurchasePanel }) => {
  const { optionData, setSelectedOptionData, loading } =
    useContext(OptionsContext);
  const { selectedBaseAsset, baseAssetsWithPrices } = useContext(AssetsContext);

  const screenType = useScreenType();

  const [greeksToShow, setGreeksToShow] = useState({
    delta: true,
    theta: true,
    gamma: false,
    vega: false,
  });

  const [isPut, setIsPut] = useState(false);

  const data = useMemo(() => {
    return makeData(optionData);
  }, [optionData]);

  const showToggleView = useMemo(() => screenType !== 'large', [screenType]);

  const {
    visibleColumns,
    setHiddenColumns,
    toggleHideAllColumns,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
  } = useTable({
    columns,
    data,
  });

  useEffect(() => {
    if (showToggleView) {
      if (isPut) {
        setHiddenColumns(callColumnsToHideOnToggleView);
      } else {
        setHiddenColumns(putColumnsToHideOnToggleView);
      }
    } else {
      toggleHideAllColumns(false);
    }
  }, [showToggleView, isPut, setHiddenColumns, toggleHideAllColumns]);

  const handleChange = useCallback(
    (event) => {
      setGreeksToShow({
        ...greeksToShow,
        [event.target.name]: event.target.checked,
      });
    },
    [greeksToShow]
  );

  useEffect(() => {
    if (showToggleView) return;
    const columnsToHide = Object.keys(greeksToShow)
      .filter((item) => {
        return !greeksToShow[item];
      })
      .map((item) => {
        return greekColumns[item];
      })
      .flat();

    setHiddenColumns(columnsToHide);
  }, [greeksToShow, setHiddenColumns, visibleColumns, showToggleView]);

  const navigate = useNavigate();

  const handleAddLiquidity = useCallback(() => navigate('/pools'), [navigate]);

  return (
    <Box className="text-white bg-cod-gray rounded-xl pt-5 flex flex-col space-y-4 w-full">
      {baseAssetsWithPrices && selectedBaseAsset ? (
        <Box className="flex justify-between px-5">
          <Typography variant="h5" className="text-stieglitz">
            {baseAssetsWithPrices[selectedBaseAsset].fullName} Options
          </Typography>
          <CustomButton size="medium" onClick={handleAddLiquidity}>
            Add Liquidity
          </CustomButton>
        </Box>
      ) : null}
      <Box className="flex justify-between items-center px-5">
        <ExpirySelector />
        <GreeksFilter greeksToShow={greeksToShow} handleChange={handleChange} />
      </Box>
      {showToggleView ? (
        <Box className="grid grid-cols-2 gap-2 px-5">
          <Typography
            variant="h5"
            component="div"
            textAlign="center"
            className={cx(
              'bg-umbra uppercase rounded-md py-1',
              isPut ? 'opacity-40' : ''
            )}
            role="button"
            onClick={() => setIsPut(false)}
          >
            CALLS
          </Typography>
          <Typography
            variant="h5"
            component="div"
            textAlign="center"
            className={cx(
              'bg-umbra uppercase rounded-md py-1',
              !isPut ? 'opacity-40' : ''
            )}
            role="button"
            onClick={() => setIsPut(true)}
          >
            PUTS
          </Typography>
        </Box>
      ) : null}
      {loading ? (
        <Box className="flex flex-col p-5 space-y-8">
          {Array(7)
            .join()
            .split(',')
            .map((_i, index) => {
              return (
                <Skeleton
                  key={index}
                  variant="rect"
                  animation="wave"
                  height={40}
                  className="bg-umbra"
                />
              );
            })}
        </Box>
      ) : (
        <TableContainer>
          <Table aria-label="options-chain" {...getTableProps}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    return column.render('Header', {
                      headerProps: column.getHeaderProps(),
                      key: column.getHeaderProps().key,
                    });
                  })}
                </TableRow>
              ))}
            </TableHead>
            <TableBody className="text-white" {...getTableBodyProps()}>
              {rows.map((row, index) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      const isBuyColumn =
                        cell.column.id === 'callOptionPrice' ||
                        cell.column.id === 'putOptionPrice';
                      return cell.render('Cell', {
                        isCallItm: optionData[index].isCallItm,
                        isPutItm: optionData[index].isPutItm,
                        cellProps: cell.getCellProps(),
                        key: cell.getCellProps().key,
                        ...(isBuyColumn && {
                          setSelectedOptionData,
                          scrollToPurchasePanel,
                        }),
                      });
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default OptionChain;
