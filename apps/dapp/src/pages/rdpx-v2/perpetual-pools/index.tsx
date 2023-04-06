import { useEffect, useMemo } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import Title from 'components/perpetual-pools/Title';
import Stats from 'components/perpetual-pools/Stats';
import Description from 'components/perpetual-pools/Description';
import DepositPanel from 'components/perpetual-pools/DepositPanel';
import DepositTable from 'components/perpetual-pools/DepositTable';

import { useBoundStore } from 'store';

import { getUserReadableAmount } from 'utils/contracts';
import { formatAmount } from 'utils/general';

/*
Top component
- Perpetual Pool Title
- Boredered Description with 'learn more' button redirect
- Perpetual pool contract data
Center component
- User Deposits table
Aside component
- Deposit panel
*/

const statsKeys = [
  'Funding Rate',
  'APR',
  'Options Sold',
  'Premiums',
  'Utilization Rate',
  'Contract',
];

// const statsValues = ['-', '-', '-', '-', '-', '-'];

export type StatsType = Record<string, string | number | undefined>;

const PerpetualPutsPage = () => {
  const {
    provider,
    chainId,
    updateAPPContractData,
    updateAPPUserData,
    appContractData,
  } = useBoundStore();

  const stats = useMemo(() => {
    if (!appContractData || !appContractData.contract) return;
    const utilizationRate = getUserReadableAmount(
      appContractData.utilizationRate
    );
    return [
      { value: '-' },
      { value: '-' },
      { value: '-' },
      { value: '-' },
      {
        value: formatAmount(utilizationRate, 3),
        tooltip:
          'Ratio of active collateral from purchased options to total collateral in the pool',
      },
      { value: appContractData.contract.address },
    ] as StatsType[];
  }, [appContractData]);

  useEffect(() => {
    updateAPPContractData().then(() => {
      updateAPPUserData();
    });
  }, [provider, updateAPPContractData, updateAPPUserData]);

  return (
    <Box className="bg-contain min-h-screen">
      <Head>
        <title>APP | Dopex</title>
      </Head>
      <AppBar active="Perpetual Pool" />
      <Box className="pt-1 pb-32 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 min-h-screen">
        <Box className="py-12 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
          <Box className="flex mt-20 lg:space-x-3 flex-col sm:flex-col md:flex-col lg:flex-row">
            <Box className="flex flex-col space-y-8 w-full sm:w-full lg:w-3/4 h-full">
              <Title
                title="Perpetual Pools"
                subtitle={
                  appContractData.underlyingSymbol.toUpperCase() || 'USDC'
                }
              />
              <Description />
              <Stats
                statsObject={Object.fromEntries(
                  statsKeys.map((_, i) =>
                    stats ? [statsKeys[i], stats[i]] : [statsKeys[i], '-']
                  )
                )}
                chainId={chainId}
              />
              <DepositTable />
            </Box>
            <Box className="flex flex-col w-full sm:w-full lg:w-1/4 h-full mt-4 lg:mt-0">
              <DepositPanel />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PerpetualPutsPage;
