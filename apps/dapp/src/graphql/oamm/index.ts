import { graphql } from 'gql/oamm';

export const getActiveExpiries = graphql(`
  query getActiveExpiries {
    activeExpiries {
      id
      expiry
    }
  }
`);
