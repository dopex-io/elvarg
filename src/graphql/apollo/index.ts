import { ApolloClient, InMemoryCache } from '@apollo/client';

export const otcGraphClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/psytama/dopex-otc',
  cache: new InMemoryCache(),
});

export const portfolioGraphClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/psytama/dopex-ssov',
  cache: new InMemoryCache(),
});
