import { useContext } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';

import AppBar from 'components/common/AppBar';
// import Typography from 'components/UI/Typography';
import ManageCard from 'components/atlantics/Manage/ManageCard';
import Charts from 'components/atlantics/Charts';
import ManageTitle from 'components/atlantics/Manage/ManageTitle';
import ContractData from 'components/atlantics/Manage/ContractData';
import PoolCompositionTable from 'components/atlantics/PoolCompositionTable';
import Typography from 'components/UI/Typography';

import { AtlanticsContext } from 'contexts/Atlantics';

// @ts-ignore TODO: fix this
const Manage = ({ poolType, underlying, tokenId, strategy, epochLength }) => {
  // todo: get selected pool/market contract from context
  const { /* atlanticPoolEpochData,*/ selectedMarket } =
    useContext(AtlanticsContext);

  console.log(selectedMarket);

  return (
    <Box className="bg-black bg-contain bg-no-repeat min-h-screen">
      <Head>
        <title>Atlantics | Dopex</title>
      </Head>
      <AppBar active="atlantics" />
      <Box className="container pt-32 mx-auto px-4 lg:px-0 h-screen">
        <Box className="flex space-x-3">
          <Box className="flex flex-col w-3/4 space-y-8 mx-2">
            <ManageTitle
              tokenId={tokenId}
              underlying={underlying}
              poolType={poolType}
              strategy={strategy}
              epochLength={epochLength}
            />
            <ContractData
              epoch={1}
              contractAddress={'0x0'}
              fundingRate={0.1}
              poolType={poolType}
            />
            <Box className="w-full space-y-4">
              <Typography variant="h5">Liquidity</Typography>
              <Charts />
            </Box>
            <Box className="w-full space-y-4">
              <Typography variant="h5">Composition</Typography>
              <PoolCompositionTable />
            </Box>
            <Box className="w-full space-y-4">
              <Typography variant="h5">Deposits</Typography>
              <></>
            </Box>
          </Box>
          <ManageCard tokenId={tokenId} underlying={underlying} />
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
      poolType: context.query.atlantics[0],
      underlying: context.query.atlantics[1],
      tokenId: context.query.atlantics[2],
      strategy: context.query.atlantics[3],
      epochLength: context.query.atlantics[4],
    },
  };
}

export default Manage;
