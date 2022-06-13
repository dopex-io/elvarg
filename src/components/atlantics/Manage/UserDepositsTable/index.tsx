import { useContext, useEffect, useState, useMemo } from 'react';
import { BigNumber } from 'ethers';
import { format, formatDistance } from 'date-fns';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import { Box } from '@mui/system';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import AlarmIcon from 'svgs/icons/AlarmIcon';

import { AtlanticsContext } from 'contexts/Atlantics';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import formatAmount from 'utils/general/formatAmount';

import { WalletContext } from 'contexts/Wallet';

const TableHeader = ({
  // @ts-ignore TODO: FIX
  children,
  align = 'left',
  textColor = 'stieglitz',
  width = 100,
}) => {
  return (
    // @ts-ignore TODO: FIX
    <TableCell
      align={align as TableCellProps['align']}
      component="th"
      className="bg-cod-gray border-1 border-b-0 border-umbra py-2"
      sx={{ width }}
    >
      <Typography variant="h6" className={`text-${textColor}`}>
        {children}
      </Typography>
    </TableCell>
  );
};

const TableBodyCell = ({
  // @ts-ignore TODO: FIX
  children,
  align = 'left',
  textColor = 'stieglitz',
  fill = 'bg-cod-gray',
  width = 100,
}) => {
  return (
    // @ts-ignore TODO: FIX
    <TableCell
      align={align as TableCellProps['align']}
      component="td"
      className={`${fill} border-0 py-3`}
      sx={{ width }}
    >
      <Typography variant="h6" className={`text-${textColor}`}>
        {children}
      </Typography>
    </TableCell>
  );
};

const TokenSymbol = ({ token }: { token: string }) => (
  <img
    src={`/images/tokens/${token.toLowerCase()}.svg`}
    alt={token.toLowerCase()}
    className="w-[1.2rem] ml-1"
  />
);

const CustomTableHeader = ({
  token,
  header,
}: {
  token: string | undefined;
  header: string;
}) =>
  token ? (
    <TableHeader>
      <Box className="flex  items-center">
        <Typography variant="h6">{header}</Typography>
        <TokenSymbol token={token} />
      </Box>
    </TableHeader>
  ) : (
    <> ... </>
  );

const UserDepositsTable = () => {
  const { chainId } = useContext(WalletContext);
  const { userPositions, selectedPool, revenue } = useContext(AtlanticsContext);

  const [epochDuration, setEpochDuration] = useState('');

  useEffect(() => {
    (async () => {
      const epochTimes = {
        startTime: selectedPool?.state.startTime ?? BigNumber.from(0),
        expiryTime: selectedPool?.state.expiryTime ?? BigNumber.from(0),
      };

      const duration = formatDistance(
        epochTimes['expiryTime'].toNumber() * 1000,
        epochTimes['startTime'].toNumber() * 1000
      );

      setEpochDuration(duration);
    })();
  }, [selectedPool]);

  return (
    <TableContainer className={`rounded-xl max-h-80 w-full overflow-x-auto`}>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>
              Max Strike <ArrowDownwardRoundedIcon className="p-1 my-auto" />
            </TableHeader>
            <TableHeader>Deposit Date</TableHeader>
            <CustomTableHeader
              token={selectedPool?.tokens.deposit}
              header="Liquidity"
            />
            <CustomTableHeader
              token={selectedPool?.tokens.deposit}
              header="Premia"
            />
            <CustomTableHeader
              token={selectedPool?.tokens.deposit}
              header="funding"
            />
            {selectedPool?.isPut && (
              <CustomTableHeader
                token={selectedPool?.tokens.deposit}
                header="Underlying"
              />
            )}
            <TableHeader align="right">Settle</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {userPositions?.length !== 0 ? (
            userPositions?.map((position, index) => (
              <TableRow key={index}>
                <TableBodyCell>{position.strike}</TableBodyCell>
                <TableBodyCell>
                  <Typography variant="h6">
                    {format(new Date(position.timestamp * 1000), 'd LLLL yyyy')}
                  </Typography>
                </TableBodyCell>
                <TableBodyCell>
                  <Typography variant="h6">
                    {formatAmount(
                      getUserReadableAmount(
                        // @ts-ignore
                        position.liquidity,
                        getTokenDecimals(
                          selectedPool?.tokens?.deposit as string,
                          chainId
                        )
                      ),
                      3,
                      true
                    )}{' '}
                  </Typography>
                </TableBodyCell>
                <TableBodyCell>
                  <Typography variant="h6">
                    {formatAmount(
                      getUserReadableAmount(
                        // @ts-ignore
                        revenue[index]?.premium,
                        getTokenDecimals(
                          selectedPool?.tokens?.deposit as string,
                          chainId
                        )
                      ),
                      3,
                      true
                    )}
                  </Typography>
                </TableBodyCell>
                <TableBodyCell>
                  <Typography variant="h6">
                    {formatAmount(
                      getUserReadableAmount(
                        // @ts-ignore
                        revenue[index]?.funding,
                        getTokenDecimals(
                          selectedPool?.tokens?.deposit as string,
                          chainId
                        )
                      ),
                      3,
                      true
                    )}
                  </Typography>
                </TableBodyCell>{' '}
                {selectedPool?.isPut && (
                  <TableBodyCell>
                    <Typography variant="h6">
                      {formatAmount(
                        getUserReadableAmount(
                          // @ts-ignore
                          revenue[index]?.underlying,
                          getTokenDecimals(
                            selectedPool?.tokens?.deposit as string,
                            chainId
                          )
                        ),
                        3,
                        true
                      )}
                    </Typography>
                  </TableBodyCell>
                )}
                <TableBodyCell align="right">
                  <CustomButton
                    onClick={() => {
                      console.log('Clicked');
                    }}
                    disabled={true}
                    color={'mineshaft'}
                    className="space-x-3 p-2 rounded-lg bg-umbra"
                  >
                    <AlarmIcon fill="#8E8E8E" />
                    <Typography variant="h6" className="my-auto">
                      {epochDuration}
                    </Typography>
                  </CustomButton>
                </TableBodyCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>
                <Typography variant="h6">No positions found</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserDepositsTable;
