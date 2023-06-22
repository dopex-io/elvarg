import { CodegenConfig } from '@graphql-codegen/cli';

const DOPEX_STRADDLES_SUBGRAPH_API_URL =
  'https://api.thegraph.com/subgraphs/name/psytama/dopex-straddles';

const DOPEX_POLYGON_STRADDLE_SUBGRAPH_API_URL =
  'https://api.thegraph.com/subgraphs/name/psytama/dopex-straddles-polygon';

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
    './src/gql/polygon-straddles/': {
      schema: DOPEX_ZDTE_SUBGRAPH_API_URL,
      documents: ['src/graphql/zdte/*.ts'],
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
// generates:
//   ./src/graphql/generated/portfolio.ts:
//     schema: https://api.thegraph.com/subgraphs/name/psytama/dopex-ssov
//     plugins:
//       - typescript
//       - typescript-operations
//       - typescript-react-apollo
//     config:
//       withHooks: true
//       defaultScalarType: string
//     documents: 'src/graphql/portfolio/**/*.graphql'
//   ./src/graphql/generated/portfolioStraddles.ts:
//     schema: https://api.thegraph.com/subgraphs/name/psytama/dopex-straddles
//     plugins:
//       - typescript
//       - typescript-operations
//       - typescript-react-apollo
//     config:
//       withHooks: true
//       defaultScalarType: string
//     documents: 'src/graphql/portfolioStraddles/**/*.graphql'
//   ./src/graphql/generated/optionScalps.ts:
//     schema: https://api.thegraph.com/subgraphs/name/aercwarden/dopex-option-scalps
//     plugins:
//       - typescript
//       - typescript-operations
//       - typescript-react-apollo
//     config:
//       withHooks: true
//       defaultScalarType: string
//     documents: 'src/graphql/optionScalps/*.graphql'
