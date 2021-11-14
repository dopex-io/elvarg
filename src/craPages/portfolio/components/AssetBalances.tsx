import { useContext } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import Box from '@material-ui/core/Box';

import AddTokenButton from 'components/AddTokenButton';
import Typography from '../../../components/UI/Typography';

import { WalletContext } from 'contexts/Wallet';
import { AssetsContext } from 'contexts/Assets';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import { S3_BUCKET_RESOURCES } from 'constants/index';

const AssetBalances = () => {
  const { contractAddresses } = useContext(WalletContext);
  const {
    baseAssetsWithPrices,
    userAssetBalances,
    selectedBaseAssetDecimals,
    usdtDecimals,
  } = useContext(AssetsContext);

  return (
    <section className="bg-cod-gray rounded-lg my-2 md:mr-1.5 md:mb-1.5">
      <Typography variant="h6" className="text-xl p-3 pb-0 text-stieglitz">
        Your Assets
      </Typography>
      <Box className="portfolio-table text-white">
        <TableContainer className="p-3 pt-0">
          <Table>
            <TableHead className="bg-umbra">
              <TableRow>
                <TableCell
                  component="th"
                  className="text-stieglitz bg-cod-gray border-0 pb-2"
                >
                  <Typography variant="h6" className="text-white">
                    Asset
                  </Typography>
                </TableCell>
                <TableCell
                  component="th"
                  align="left"
                  className="text-stieglitz bg-cod-gray border-0 pb-2"
                >
                  <Typography
                    variant="h6"
                    className="text-stieglitz text-right"
                  >
                    Balance
                  </Typography>
                </TableCell>
                <TableCell
                  component="th"
                  align="right"
                  className="text-stieglitz bg-cod-gray border-0 pb-2"
                >
                  <Typography variant="h6" className="text-stieglitz">
                    Price
                  </Typography>
                </TableCell>
                <TableCell
                  component="th"
                  align="right"
                  className="bg-cod-gray border-0 pb-2"
                >
                  {' '}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="bg-umbra">
              {baseAssetsWithPrices
                ? Object.keys(baseAssetsWithPrices).map((asset) => {
                    const { price, _symbol } = baseAssetsWithPrices[asset];

                    const fPrice = getUserReadableAmount(price, 8);
                    return (
                      <TableRow key={asset}>
                        <TableCell
                          component="td"
                          className="text-white border-0"
                        >
                          <Box className="flex items-center">
                            <img
                              src={`/static/svg/tokens/${baseAssetsWithPrices[
                                asset
                              ].symbol.toLowerCase()}.svg`}
                              className="w-6 h-6"
                              alt="Symbol"
                            />
                            <span className="pl-2">{_symbol}</span>
                          </Box>
                        </TableCell>
                        <TableCell
                          component="td"
                          className="text-white border-0"
                          align="right"
                        >
                          <span>
                            {formatAmount(
                              getUserReadableAmount(
                                userAssetBalances[asset],
                                18
                              ),
                              3
                            )}
                          </span>
                        </TableCell>
                        <TableCell
                          align="right"
                          component="td"
                          className="text-white border-0"
                        >
                          {'$'}
                          {fPrice}
                        </TableCell>
                        <TableCell
                          align="right"
                          component="td"
                          className="border-0 p-1"
                        >
                          <AddTokenButton
                            options={{
                              address: contractAddresses
                                ? contractAddresses[asset]
                                : '',
                              symbol: asset,
                              decimals: selectedBaseAssetDecimals,
                              image: S3_BUCKET_RESOURCES[asset],
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                : null}
              <TableRow>
                <TableCell component="td" className="text-white border-0">
                  <Box className="flex items-center">
                    <img
                      src={'/assets/usdt.svg'}
                      className="w-6 h-6"
                      alt="Symbol"
                    />
                    <span className="pl-2">USDT</span>
                  </Box>
                </TableCell>
                <TableCell
                  component="td"
                  className="text-white border-0"
                  align="right"
                >
                  <span>
                    {formatAmount(
                      getUserReadableAmount(userAssetBalances['USDT'], 6),
                      3
                    )}
                  </span>
                </TableCell>
                <TableCell
                  align="right"
                  component="td"
                  className="text-white border-0"
                >
                  --
                </TableCell>
                <TableCell
                  align="right"
                  component="td"
                  className="border-0 p-1"
                >
                  <AddTokenButton
                    options={{
                      address: contractAddresses
                        ? contractAddresses['USDT']
                        : '',
                      symbol: 'USDT',
                      decimals: usdtDecimals,
                    }}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </section>
  );
};

export default AssetBalances;
