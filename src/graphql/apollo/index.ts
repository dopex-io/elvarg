import { ApolloClient, InMemoryCache } from '@apollo/client';

export const optionPoolsClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/psytama/dopex',
  cache: new InMemoryCache(),
});

export const otcGraphClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/psytama/dopex-otc',
  cache: new InMemoryCache(),
});
