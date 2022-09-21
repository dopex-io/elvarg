import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { SsovV3__factory } from '@dopex-io/sdk';
import {
  GetUserDataDocument,
  GetUserDataQuery,
} from 'graphql/generated/portfolio';
import { portfolioGraphClient } from 'graphql/apollo';
import { ApolloQueryResult } from '@apollo/client';

import { WalletContext } from './Wallet';

import getLinkFromVaultName from 'utils/contracts/getLinkFromVaultName';

export interface UserPosition {
  amount: string;
  epoch: string;
  strike: string;
  ssovAddress: string;
  ssovName: string;
  assetName: string;
  fee: string;
  premium: string;
  isPut: boolean;
  link: string;
  vaultType: string;
}

export interface UserSSOVDeposit {
  amount: string;
  epoch: string;
  ssovAddress: string;
  ssovName: string;
  isPut: boolean;
  assetName: string;
  strike: string;
  link: string;
  vaultType: string;
}

export interface PortfolioData {
  userPositions: UserPosition[];
  userSSOVDeposits: UserSSOVDeposit[];
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
  const { accountAddress, provider } = useContext(WalletContext);
  const [portfolioData, setPortfolioData] =
    useState<PortfolioData>(initialPortfolioData);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updatePortfolioData = useCallback(async () => {
    if (!accountAddress || !provider) return;

    const queryResult: ApolloQueryResult<GetUserDataQuery> =
      await portfolioGraphClient.query({
        query: GetUserDataDocument,
        variables: { user: accountAddress.toLowerCase() },
        fetchPolicy: 'no-cache',
      });

    const data: any = queryResult['data']['users'][0];

    const deposits: UserSSOVDeposit[] = [];
    const positions: UserPosition[] = [];

    for (let i in data?.userSSOVDeposit) {
      const ssov = SsovV3__factory.connect(
        data.userSSOVDeposit[i].ssov.id,
        provider
      );
      const ssovName = await ssov.name();
      const isPut = await ssov.isPut();
      const assetName = await ssov.underlyingSymbol();

      deposits.push({
        epoch: data.userSSOVDeposit[i].epoch,
        strike: data.userSSOVDeposit[i].strike,
        amount: data.userSSOVDeposit[i].amount,
        ssovAddress: data.userSSOVDeposit[i].ssov.id,
        assetName: assetName,
        isPut: isPut,
        ssovName: ssovName,
        link: getLinkFromVaultName(ssovName),
        vaultType: 'SSOV',
      });
    }

    for (let i in data?.userSSOVOptionBalance) {
      const ssovAddress = data.userSSOVOptionBalance[i].id.split('#')[3];

      const ssov = SsovV3__factory.connect(ssovAddress, provider);
      const ssovName = await ssov.name();

      const isPut = await ssov.isPut();
      const assetName = await ssov.underlyingSymbol();

      positions.push({
        epoch: data.userSSOVOptionBalance[i].epoch,
        strike: data.userSSOVOptionBalance[i].strike,
        amount: data.userSSOVOptionBalance[i].amount,
        fee: data.userSSOVOptionBalance[i].fee,
        premium: data.userSSOVOptionBalance[i].premium,
        ssovAddress: ssovAddress,
        assetName: assetName,
        isPut: isPut,
        ssovName: ssovName,
        link: getLinkFromVaultName(ssovName),
        vaultType: 'SSOV',
      });
    }

    setPortfolioData({
      userSSOVDeposits: deposits,
      userPositions: positions,
    });

    setIsLoading(false);
  }, [accountAddress, setIsLoading, provider]);

  useEffect(() => {
    updatePortfolioData();
  }, [updatePortfolioData]);

  const contextValue = {
    portfolioData,
    updatePortfolioData,
    isLoading,
  };

  return (
    <PortfolioContext.Provider value={contextValue}>
      {props.children}
    </PortfolioContext.Provider>
  );
};
