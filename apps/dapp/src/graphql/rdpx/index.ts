import { graphql } from 'gql/rdpx';

export const getPricesDocument = graphql(`
  query getPrices {
    rdpxPrices(orderBy: id, first: 1000) {
      price
      id
    }
    dscPrices(orderBy: id, first: 1000) {
      price
      id
    }
  }
`);

export const getSuppliesDocument = graphql(`
  query getSupplies {
    dscSupplies(orderBy: id, first: 1000) {
      id
      totalSupply
    }
    rdpxSupplies(orderBy: id, first: 1000) {
      id
      totalSupply
    }
  }
`);
