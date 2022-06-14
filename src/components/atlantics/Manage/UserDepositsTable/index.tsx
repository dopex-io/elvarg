import { useCallback, useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';
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

import { AtlanticsContext } from 'contexts/Atlantics';

import useSendTx from 'hooks/useSendTx';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import getTokenDecimals from 'utils/general/getTokenDecimals';
import formatAmount from 'utils/general/formatAmount';

import { WalletContext } from 'contexts/Wallet';
import {
  AtlanticCallsPool,
  AtlanticCallsPool__factory,
  AtlanticPutsPool,
  AtlanticPutsPool__factory,
} from '@dopex-io/sdk';

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
  const { chainId, provider, signer } = useContext(WalletContext);
  const { userPositions, selectedPool, revenue, selectedEpoch } =
    useContext(AtlanticsContext);
  const [canWithdraw, setCanWithdraw] = useState<boolean>(true);

  const tx = useSendTx();

  useEffect(() => {
    (async () => {
      if (!selectedPool || !provider) return;
      const blockNumber = await provider.getBlockNumber();
      const timestamp = (await provider.getBlock(blockNumber)).timestamp;
      if (timestamp > Number(selectedPool.state.expiryTime)) {
        setCanWithdraw(() => false);
      }
    })();
  }, [provider, selectedPool]);

  const handleWithdraw = useCallback(
    async (strike: number) => {
      if (
        !selectedPool?.contracts?.atlanticPool.address ||
        !selectedPool ||
        !selectedEpoch ||
        !signer
      ) {
        return;
      }

      const poolAddress = selectedPool.contracts.atlanticPool.address;
      if (selectedPool.isPut) {
        const apContract = AtlanticPutsPool__factory.connect(
          poolAddress,
          signer
        );
        tx(apContract.withdraw(strike * 1e8, selectedEpoch));
      } else {
        const apContract = AtlanticCallsPool__factory.connect(
          poolAddress,
          signer
        );
        tx(apContract.withdraw(selectedEpoch));
      }
    },
    [selectedEpoch, selectedPool, signer, tx]
  );

  return (
    <TableContainer className={`rounded-xl max-h-80 w-full overflow-x-auto`}>
      <Table>
        <TableHead>
          <TableRow>
            {selectedPool?.isPut && (
              <TableHeader>
                Max Strike <ArrowDownwardRoundedIcon className="p-1 my-auto" />
              </TableHeader>
            )}
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
              header="Funding"
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
                {selectedPool?.isPut && (
                  <TableBodyCell>{position.strike}</TableBodyCell>
                )}
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
                    onClick={async () => {
                      await handleWithdraw(position.strike ?? 0);
                    }}
                    disabled={canWithdraw}
                    color={'mineshaft'}
                    className={`space-x-3 p-2 rounded-lg ${
                      !canWithdraw ? 'bg-primary' : 'bg-umbra'
                    }`}
                  >
                    <Typography variant="h6" className="my-auto">
                      Withdraw
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
