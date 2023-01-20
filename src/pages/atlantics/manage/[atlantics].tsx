import { useEffect, useMemo } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import Typography from 'components/UI/Typography';
import ManageCard from 'components/atlantics/Manage/ManageCard';
import Charts from 'components/atlantics/Charts';
import ManageTitle from 'components/atlantics/Manage/ManageTitle';
import ContractData from 'components/atlantics/Manage/ContractData';
import UserDepositsTable from 'components/atlantics/Manage/UserDepositsTable';

import { useBoundStore } from 'store';

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

export const Manage = (props: ManageProps) => {
  const { underlying, type, duration, tokenId } = props;
  let { title }: Info = ATLANTIC_POOL_INFO[type]!;

  const {
    signer,
    provider,
    atlanticPool,
    updateAtlanticPool,
    updateAtlanticPoolEpochData,
    selectedEpoch,
    selectedPoolName,
    setSelectedPoolName,
  } = useBoundStore();

  useEffect(() => {
    if (!underlying || !duration) return;
    updateAtlanticPool(underlying, duration);
  }, [underlying, duration, updateAtlanticPool, signer, provider]);

  useEffect(() => {
    setSelectedPoolName(`${underlying}-${type}-${duration}`);
  }, [duration, setSelectedPoolName, type, underlying]);

  useEffect(() => {
    if (!selectedPoolName || !atlanticPool) return;
    updateAtlanticPoolEpochData();
  }, [
    updateAtlanticPoolEpochData,
    selectedEpoch,
    selectedPoolName,
    atlanticPool,
  ]);

  const depositToken = useMemo((): string => {
    if (!atlanticPool) return '';
    const deposit = atlanticPool.tokens?.depositToken;
    if (deposit) {
      return deposit;
    } else {
      return atlanticPool.tokens.underlying;
    }
  }, [atlanticPool]);

  return (
    <Box className="bg-black bg-contain bg-no-repeat h-screen">
      <Head>
        <title>Atlantics | Dopex</title>
      </Head>
      <AppBar active="Atlantics" />
      <Box className="py-12 lg:max-w-7xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <Box className="flex mt-20 space-x-0 lg:space-x-3 flex-col sm:flex-col md:flex-col lg:flex-row">
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
              <Box className="flex space-x-2">
                <Typography variant="h5" className="my-auto">
                  Deposits
                </Typography>
              </Box>
              <UserDepositsTable />
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
      <Manage
        tokenId={props.query}
        underlying={split[0]!}
        type={split[1]!}
        duration={split[2]!}
      />
    )
  );
};

export default ManagePage;
