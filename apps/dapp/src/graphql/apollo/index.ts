import { ApolloClient, InMemoryCache } from '@apollo/client';

export const portfolioGraphClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/psytama/dopex-ssov',
  cache: new InMemoryCache(),
});

export const portfolioStraddlesGraphClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/psytama/dopex-straddles',
  cache: new InMemoryCache(),
});

export const optionScalpsPositionDataGraphClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/aercwarden/dopex-option-scalps',
  cache: new InMemoryCache(),
});
