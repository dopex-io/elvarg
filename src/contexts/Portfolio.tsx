import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import {
  GetUserDataDocument,
  GetUserDataQuery,
} from 'graphql/generated/portfolio';
import { portfolioGraphClient } from 'graphql/apollo';
import { ApolloQueryResult } from '@apollo/client';

import { WalletContext } from './Wallet';

export interface UserPosition {
  amount: string;
  epoch: string;
  id: string;
  strike: string;
}

export interface userSSOVDeposit {
  amount: string;
  epoch: string;
  id: string;
  sender: string;
  ssov: { id: string };
  strike: string;
  token: { id: string };
  transaction: { id: string };
  user: { id: string };
}

export interface PortfolioData {
  userPositions: UserPosition[];
  userSSOVDeposits: userSSOVDeposit[];
}

interface PortfolioContextInterface {
  portfolioData?: PortfolioData;
  updatePortfolioData?: Function;
  isLoading?: boolean;
  setIsLoading?: Function;
}

const initialPortfolioData = {
  userPositions: [],
  userSSOVDeposits: [],
  isLoading: true,
};

export const PortfolioContext = createContext<PortfolioContextInterface>({
  portfolioData: initialPortfolioData,
});

export const PortfolioProvider = (props: { children: ReactNode }) => {
  const accountAddress = '0x6f8d0c0a2b28df39cf2a4727d3ecfb60e9ddad27';
  const portfolioData = useState<PortfolioData>(initialPortfolioData);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updatePortfolioData = useCallback(async () => {
    if (!accountAddress) return;

    const queryResult: ApolloQueryResult<GetUserDataQuery> =
      await portfolioGraphClient.query({
        query: GetUserDataDocument,
        variables: { user: accountAddress.toLowerCase() },
        fetchPolicy: 'no-cache',
      });

    const { data }: any = queryResult;
    console.log(data);

    setIsLoading(false);
  }, [accountAddress, setIsLoading]);

  useEffect(() => {
    updatePortfolioData();
  }, [updatePortfolioData]);

  const contextValue = {
    portfolioData,
    updatePortfolioData,
    isLoading,
  };

  return (
    // @ts-ignore
    <PortfolioContext.Provider value={contextValue}>
      {props.children}
    </PortfolioContext.Provider>
  );
};
