import { useContext, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import ManageCard from 'components/atlantics/Manage/ManageCard';
import Charts from 'components/atlantics/Charts';
import ManageTitle from 'components/atlantics/Manage/ManageTitle';
import ContractData from 'components/atlantics/Manage/ContractData';
import Typography from 'components/UI/Typography';
import UserDepositsTable from 'components/atlantics/Manage/UserDepositsTable';
import UserPositions from 'components/atlantics/Manage/Strategies/InsuredPerps/UserPositions';

import { AtlanticsContext, AtlanticsProvider } from 'contexts/Atlantics';

import { ATLANTIC_POOL_INFO } from 'constants/atlanticPoolsInfo';

// Placeholder data for charts
const line_chart_data = [
  {
    name: '1/05',
    deposits: 4000,
    unlocks: 3420,
    amt: 2400,
  },
  {
    name: '8/05',
    deposits: 3000,
    unlocks: 2900,
    amt: 2210,
  },
  {
    name: '15/05',
    deposits: 2000,
    unlocks: 2000,
    amt: 2290,
  },
  {
    name: '22/05',
    deposits: 1890,
    unlocks: 1540,
    amt: 2181,
  },
  {
    name: '28/05',
    deposits: 2390,
    unlocks: 2100,
    amt: 2500,
  },
];

interface ManageProps {
  underlying: string;
  type: string;
  duration: string;
  tokenId: string;
}

interface Info {
  description: string;
  title: string;
}

const Manage = (props: ManageProps) => {
  const [selectedPositionTable, setSelectedPositionTable] =
    useState<string>('pool-deposits');
  const { underlying, type, duration, tokenId } = props;
  let { title }: Info = ATLANTIC_POOL_INFO[type]!;

  const { setSelectedPool, selectedPool, setSelectedEpoch, selectedEpoch } =
    useContext(AtlanticsContext);

  useEffect(() => {
    if (!underlying || !type || !duration) return;
    (async () => {
      await setSelectedPool(underlying, type, selectedEpoch, duration);
    })();
  }, [
    setSelectedPool,
    duration,
    type,
    underlying,
    selectedEpoch,
    setSelectedEpoch,
  ]);

  const depositToken = useMemo((): string => {
    if (!selectedPool) return '';
    const { deposit } = selectedPool.tokens;
    if (deposit) {
      return deposit;
    } else {
      return selectedPool.asset;
    }
  }, [selectedPool]);

  const changePositionTable = (positionTable: string) => {
    setSelectedPositionTable(() => positionTable);
  };

  return (
    <Box className="bg-black bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>Atlantics | Dopex</title>
      </Head>
      <AppBar active="Atlantics" />
      <Box className="container my-32 mx-auto px-4 lg:px-0 h-screen">
        <Box className="flex space-x-0 lg:space-x-3 flex-col sm:flex-col md:flex-col lg:flex-row">
          <Box className="flex flex-col space-y-8 w-full sm:w-full lg:w-3/4 h-full">
            <ManageTitle
              depositToken={depositToken}
              underlying={underlying}
              strategy={title}
              epochLength={duration}
              poolType={type}
            />
            <ContractData />
            <Box className="w-full space-y-4 flex flex-col">
              {type === 'CALLS' ? null : (
                <Typography variant="h5">Liquidity</Typography>
              )}
              <Charts
                line_data={line_chart_data}
                underlying={underlying}
                collateral={tokenId}
                title={title}
                type={type}
              />
            </Box>
            <Box className="w-full space-y-4">
              <Box className="flex space-x-3">
                <Typography
                  onClick={() => changePositionTable('pool-deposits')}
                  color={`${
                    selectedPositionTable !== 'pool-deposits' && 'stieglitz'
                  }`}
                  className="cursor-pointer"
                  variant="h5"
                >
                  Deposits
                </Typography>
                <Typography
                  onClick={() => changePositionTable('insured-perps')}
                  color={`${
                    selectedPositionTable !== 'insured-perps' && 'stieglitz'
                  }`}
                  className="cursor-pointer"
                  variant="h5"
                >
                  Insured Perpetuals
                </Typography>
              </Box>
              {selectedPositionTable === 'pool-deposits' && (
                <UserDepositsTable />
              )}
              {selectedPositionTable === 'insured-perps' && <UserPositions />}
            </Box>
          </Box>
          <Box className="flex flex-col w-full sm:w-full lg:w-1/4 h-full mt-4 lg:mt-0">
            <ManageCard
              tokenId={tokenId}
              underlying={underlying}
              poolType={type}
              duration={duration}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export async function getServerSideProps(context: {
  query: { atlantics: string[] };
}) {
  return {
    props: {
      query: context.query.atlantics,
    },
  };
}

const ManagePage = (props: { query: string }) => {
  const split: string[] = props.query.split('-');
  return (
    props.query && (
      <AtlanticsProvider>
        <Manage
          tokenId={props.query}
          underlying={split[0]!}
          type={split[1]!}
          duration={split[2]!}
        />
      </AtlanticsProvider>
    )
  );
};

export default ManagePage;
