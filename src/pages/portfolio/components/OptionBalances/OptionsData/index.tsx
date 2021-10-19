import { useState, useLayoutEffect } from 'react';
import { useWindowSize } from 'react-use';
import cx from 'classnames';
import TableHead from '@material-ui/core/TableHead';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import Box from '@material-ui/core/Box';
import TablePagination from '@material-ui/core/TablePagination';

import OptionsTableData from './OptionsTableData';
import OptionsDataSm from './OptionsDataSm';
import TablePaginationActions from 'components/UI/TablePaginationActions';
import Typography from 'components/UI/Typography';

import { OptionData } from 'types';

import styles from './styles.module.scss';

interface OptionsDataProps {
  asset: string;
  fullName: string;
  assetOptions: (OptionData & {
    isDelegated: boolean;
    claimAmount?: string;
  })[];
  price: string;
  selectedIndex: number;
}

const ROWS_PER_PAGE = 4;

const OptionsTableDataHeader = ({
  children,
  align = 'left',
  textColor = 'text-stieglitz',
}) => {
  return (
    <TableCell
      align={align as TableCellProps['align']}
      component="th"
      className="bg-cod-gray border-0 py-0"
    >
      <Typography variant="h6" className={`${textColor}`}>
        {children}
      </Typography>
    </TableCell>
  );
};

const OptionsData = (props: OptionsDataProps) => {
  const { width } = useWindowSize();
  const { price, asset, assetOptions = [] } = props;
  const [page, setPage] = useState(0);
  const [smViewport, setSmViewport] = useState(false);
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  useLayoutEffect(() => {
    width < 768 ? setSmViewport(true) : setSmViewport(false);
  }, [width, smViewport]);
  return (
    <>
      <Box className="text-white">
        {!smViewport ? (
          assetOptions.length !== 0 ? (
            <TableContainer
              className={cx(
                styles.optionsTable,
                'bg-cod-gray rounded-lg p-3 py-0'
              )}
            >
              <Table>
                <TableHead className="bg-umbra">
                  <TableRow className="bg-umbra">
                    <OptionsTableDataHeader textColor="text-white">
                      Option
                    </OptionsTableDataHeader>
                    <OptionsTableDataHeader>Expiry</OptionsTableDataHeader>
                    <OptionsTableDataHeader>Amount</OptionsTableDataHeader>
                    <OptionsTableDataHeader>Option Type</OptionsTableDataHeader>
                    <OptionsTableDataHeader>
                      Strike Price
                    </OptionsTableDataHeader>
                    <OptionsTableDataHeader>
                      Premium Paid
                    </OptionsTableDataHeader>
                    <OptionsTableDataHeader>
                      Current Value
                    </OptionsTableDataHeader>
                    <OptionsTableDataHeader>Final P&L</OptionsTableDataHeader>
                    <OptionsTableDataHeader align="right">
                      Actions
                    </OptionsTableDataHeader>
                  </TableRow>
                </TableHead>
                <TableBody className={cx('rounded-lg')}>
                  {assetOptions
                    ?.slice(
                      page * ROWS_PER_PAGE,
                      page * ROWS_PER_PAGE + ROWS_PER_PAGE
                    )
                    .map(
                      (
                        {
                          expiry,
                          strike,
                          isPut,
                          userBalance,
                          optionsContract,
                          optionsContractId,
                          claimAmount,
                          isDelegated,
                        },
                        index
                      ) => {
                        return (
                          <OptionsTableData
                            key={index}
                            asset={asset}
                            expiry={expiry}
                            strike={strike}
                            isPut={isPut}
                            userBalance={userBalance}
                            optionsContract={optionsContract}
                            optionsContractId={optionsContractId}
                            assetPrice={price}
                            isDelegated={isDelegated}
                            claimAmount={claimAmount}
                          />
                        );
                      }
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null
        ) : (
          <Box className="flex flex-col">
            {assetOptions
              .slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)
              ?.map(
                (
                  {
                    expiry,
                    strike,
                    isPut,
                    userBalance,
                    optionsContract,
                    optionsContractId,
                    claimAmount,
                    isDelegated,
                  },
                  index
                ) => {
                  return (
                    <OptionsDataSm
                      key={index}
                      asset={asset}
                      expiry={expiry}
                      strike={strike}
                      isPut={isPut}
                      userBalance={userBalance}
                      optionsContract={optionsContract}
                      optionsContractId={optionsContractId}
                      assetPrice={price}
                      isDelegated={isDelegated}
                      claimAmount={claimAmount}
                    />
                  );
                }
              )}
          </Box>
        )}
        {assetOptions.length > ROWS_PER_PAGE ? (
          <TablePagination
            component="div"
            rowsPerPageOptions={[ROWS_PER_PAGE]}
            count={assetOptions.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={ROWS_PER_PAGE}
            className="text-stieglitz border-0 flex flex-grow justify-center"
            ActionsComponent={TablePaginationActions}
          />
        ) : null}
      </Box>
    </>
  );
};

export default OptionsData;
