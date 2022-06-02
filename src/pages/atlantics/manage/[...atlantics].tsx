import { useContext, useEffect } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
import ManageCard from 'components/atlantics/Manage/ManageCard';
import Charts from 'components/atlantics/Charts';
import ManageTitle from 'components/atlantics/Manage/ManageTitle';
import ContractData from 'components/atlantics/Manage/ContractData';
import PoolCompositionTable from 'components/atlantics/Manage/PoolCompositionTable';
import Typography from 'components/UI/Typography';
import UserDepositsTable from 'components/atlantics/Manage/UserDepositsTable';

import { AtlanticsContext, AtlanticsProvider } from 'contexts/Atlantics';

const bar_graph_data = [
  {
    available: 403,
    borrowed: 1201,
    strike: '3500',
  },
  {
    strike: '3000',
    available: 713,
    borrowed: 2405,
  },
  {
    strike: '2500',
    available: 810,
    borrowed: 2810,
  },
  {
    strike: '2000',
    available: 910,
    borrowed: 3198,
  },
  {
    strike: '1500',
    available: 1000,
    borrowed: 4400,
  },
];

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
  poolType: string;
  underlying: string;
  tokenId: string;
  strategy: string;
  epochLength: string;
}

const Manage = (props: ManageProps) => {
  const { poolType, underlying, tokenId, strategy } = props;

  const { atlanticPoolData, setSelectedMarket, setSelectedStrategy } =
    useContext(AtlanticsContext);

  useEffect(() => {
    (async () => {
      setSelectedMarket(tokenId);
      setSelectedStrategy(strategy);
    })();
  }, [setSelectedMarket, setSelectedStrategy, strategy, tokenId]);

  return (
    <Box className="bg-black bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>Atlantics | Dopex</title>
      </Head>
      <AppBar active="atlantics" />
      <Box className="container pt-32 mx-auto px-4 lg:px-0 h-screen">
        <Box className="flex space-x-0 sm:space-x-3 flex-col sm:flex-col md:flex-col lg:flex-row">
          <Box className="flex flex-col space-y-8 w-full sm:w-full lg:w-3/4 h-full">
            <ManageTitle
              tokenId={tokenId}
              underlying={underlying}
              strategy={strategy}
              poolType={poolType}
              epochLength={atlanticPoolData.expiryType}
            />
            <ContractData />
            <Box className="w-full space-y-4 flex flex-col">
              <Typography variant="h5">Liquidity</Typography>
              <Charts
                line_data={line_chart_data}
                bar_data={bar_graph_data}
                underlying={underlying}
                collateral={tokenId}
                strategy={strategy}
              />
            </Box>
            <Box className="w-full space-y-4">
              <Typography variant="h5">Composition</Typography>
              <PoolCompositionTable
                underlying={tokenId} // todo: fix naming of underlying and collateral variables
                collateral={underlying}
              />
            </Box>
            <Box className="w-full space-y-4">
              <Typography variant="h5">Deposits</Typography>
              <UserDepositsTable data={[]} />
            </Box>
          </Box>
          <Box className="flex flex-col w-full sm:w-full lg:w-1/4 h-full">
            <ManageCard
              tokenId={tokenId}
              underlying={underlying}
              poolType={poolType}
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
      strategy: context.query.atlantics[0],
      underlying: context.query.atlantics[1]?.split('-')[0],
      tokenId: context.query.atlantics[1]?.split('-')[1],
      poolType: context.query.atlantics[1]?.split('-')[2],
      epochLength: context.query.atlantics[1]?.split('-')[3],
    },
  };
}

const ManagePage = (props: {
  poolType: string;
  underlying: string;
  tokenId: string;
  strategy: string;
  epochLength: string;
}) => {
  return (
    <AtlanticsProvider>
      <Manage
        poolType={props.poolType}
        underlying={props.underlying}
        tokenId={props.tokenId}
        strategy={props.strategy}
        epochLength={props.epochLength}
      />
    </AtlanticsProvider>
  );
};

export default ManagePage;
