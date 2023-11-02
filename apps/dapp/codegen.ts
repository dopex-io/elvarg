import { CodegenConfig } from '@graphql-codegen/cli';

const DOPEX_STRADDLES_SUBGRAPH_API_URL =
  'https://api.thegraph.com/subgraphs/name/psytama/dopex-straddles';

const DOPEX_SSOV_SUBGRAPH_API_URL =
  'https://api.thegraph.com/subgraphs/name/psytama/dopex-ssov';

const DOPEX_POLYGON_SSOV_SUBGRAPH_API_URL =
  'https://api.thegraph.com/subgraphs/name/garyunwin42/dopex-ssov-polygon';

export const DOPEX_RDPX_SUBGRAPH_API_URL =
  'https://api.thegraph.com/subgraphs/name/psytama/rdpxv2';

export const DOPEX_RDPX_V2_SUBGRAPH_API_URL =
  'https://api.thegraph.com/subgraphs/name/hibou-de-nuit/rdpxv2';

const config: CodegenConfig = {
  generates: {
    './src/gql/straddles/': {
      schema: DOPEX_STRADDLES_SUBGRAPH_API_URL,
      documents: ['src/graphql/straddles/*.ts'],
      preset: 'client',
    },
    './src/gql/ssovs/': {
      schema: DOPEX_SSOV_SUBGRAPH_API_URL,
      documents: ['src/graphql/ssovs/*.ts'],
      preset: 'client',
    },
    './src/gql/ssovs-polygon/': {
      schema: DOPEX_POLYGON_SSOV_SUBGRAPH_API_URL,
      documents: ['src/graphql/ssovs-polygon/*.ts'],
      preset: 'client',
    },
    './src/gql/rdpx/': {
      schema: DOPEX_RDPX_SUBGRAPH_API_URL,
      documents: ['src/graphql/rdpx/*.ts'],
      preset: 'client',
    },
    './src/gql/rdpx-v2/': {
      schema: DOPEX_RDPX_V2_SUBGRAPH_API_URL,
      documents: ['src/graphql/rdpx-v2/*.ts'],
      preset: 'client',
    },
  },
};

export default config;
