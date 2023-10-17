import { CodegenConfig } from '@graphql-codegen/cli';

const DOPEX_STRADDLES_SUBGRAPH_API_URL =
  'https://api.thegraph.com/subgraphs/name/psytama/dopex-straddles';

const DOPEX_SSOV_SUBGRAPH_API_URL =
  'https://api.thegraph.com/subgraphs/name/psytama/dopex-ssov';

const DOPEX_POLYGON_SSOV_SUBGRAPH_API_URL =
  'https://api.thegraph.com/subgraphs/name/garyunwin42/dopex-ssov-polygon';

const DOPEX_OPTION_SCALPS_SUBGRAPH_API_URL =
  'https://api.thegraph.com/subgraphs/name/aercwarden/dopex-option-scalps';

const DOPEX_CLAMM_SUBGRAPH_API_URL =
  'http://api.0xgraph.xyz/subgraphs/name/dopex-v2-clamm-mvp';

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
    './src/gql/optionScalps/': {
      schema: DOPEX_OPTION_SCALPS_SUBGRAPH_API_URL,
      documents: ['src/graphql/optionScalps/*.ts'],
      preset: 'client',
    },
    './src/gql/clamm/': {
      schema: DOPEX_CLAMM_SUBGRAPH_API_URL,
      documents: ['src/graphql/clamm/*.ts'],
      preset: 'client',
    },
  },
};

export default config;
