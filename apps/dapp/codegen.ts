import { CodegenConfig } from '@graphql-codegen/cli';

const DOPEX_STRADDLES_SUBGRAPH_API_URL =
  'https://api.thegraph.com/subgraphs/name/psytama/dopex-straddles';

const DOPEX_SSOV_SUBGRAPH_API_URL =
  'https://api.thegraph.com/subgraphs/name/psytama/dopex-ssov';

const DOPEX_OPTION_SCALPS_SUBGRAPH_API_URL =
  'https://api.thegraph.com/subgraphs/name/aercwarden/dopex-option-scalps';

const DOPEX_ZDTE_SUBGRAPH_API_URL =
  'https://api.thegraph.com/subgraphs/name/garyunwin42/zdte';

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
    './src/gql/optionScalps/': {
      schema: DOPEX_OPTION_SCALPS_SUBGRAPH_API_URL,
      documents: ['src/graphql/optionScalps/*.ts'],
      preset: 'client',
    },
    './src/gql/zdte/': {
      schema: DOPEX_ZDTE_SUBGRAPH_API_URL,
      documents: ['src/graphql/zdte/*.ts'],
      preset: 'client',
    },
  },
};

export default config;
