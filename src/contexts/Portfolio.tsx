import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { SsovV3__factory, AtlanticStraddle__factory } from '@dopex-io/sdk';
import {
  GetUserDataDocument,
  GetUserDataQuery,
} from 'graphql/generated/portfolio';
import {
  GetUserStraddlesDataDocument,
  GetUserStraddlesDataQuery,
} from 'graphql/generated/portfolioStraddles';
import {
  portfolioGraphClient,
  portfolioStraddlesGraphClient,
} from 'graphql/apollo';
import { ApolloQueryResult } from '@apollo/client';

import { WalletContext } from './Wallet';

import getLinkFromVaultName from 'utils/contracts/getLinkFromVaultName';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import format from 'date-fns/format';

export interface UserSSOVPosition {
  amount: string;
  epoch: string;
  strike: string;
  ssovAddress: string;
  ssovName: string;
  assetName: string;
  fee: string;
  premium: string;
  pnl: string;
  isPut: boolean;
  link: string;
  vaultType: string;
  expiry: string;
  owner: string;
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
  owner: string;
}

export interface UserStraddlesPosition {
  vaultName: string;
  assetName: string;
  amount: string;
  epoch: string;
  strikePrice: string;
  underlyingPurchased: string;
  link: string;
  vaultType: string;
  owner: string;
}

export interface UserStraddlesDeposit {
  vaultName: string;
  assetName: string;
  amount: string;
  rollOver: boolean;
  epoch: string;
  link: string;
  vaultType: string;
  owner: string;
}

export interface PortfolioData {
  userSSOVPositions: UserSSOVPosition[];
  userSSOVDeposits: UserSSOVDeposit[];
  userStraddlesPositions: UserStraddlesPosition[];
  userStraddlesDeposits: UserStraddlesDeposit[];
}

interface PortfolioContextInterface {
  portfolioData?: PortfolioData;
  updatePortfolioData?: Function;
  isLoading?: boolean;
  setIsLoading?: Function;
}

const initialPortfolioData = {
  userSSOVPositions: [],
  userSSOVDeposits: [],
  userStraddlesPositions: [],
  userStraddlesDeposits: [],
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

    const ssovQueryResult: ApolloQueryResult<GetUserDataQuery> =
      await portfolioGraphClient.query({
        query: GetUserDataDocument,
        variables: { user: accountAddress.toLowerCase() },
        fetchPolicy: 'no-cache',
      });

    const data: any = ssovQueryResult['data']['users'][0];

    const deposits: UserSSOVDeposit[] = [];
    const positions: UserSSOVPosition[] = [];

    for (let i in data?.userSSOVDeposit) {
      const ssov = SsovV3__factory.connect(
        data.userSSOVDeposit[i].ssov.id,
        provider
      );
      const ssovName = await ssov.name();
      const isPut = await ssov.isPut();
      const assetName = await ssov.underlyingSymbol();

      const tokenId = data.userSSOVDeposit[i].id.split('#')[1];

      try {
        // if not exists then it has been withdrawn
        const owner = await ssov.ownerOf(tokenId);

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
          owner: owner,
        });
      } catch (err) {
        console.log(err);
      }
    }

    for (let i in data?.userSSOVOptionBalance) {
      const tokenId = data.userSSOVOptionBalance[i].id.split('#')[2];
      const ssovAddress = data.userSSOVOptionBalance[i].id.split('#')[3];

      const ssov = SsovV3__factory.connect(ssovAddress, provider);
      const ssovName = await ssov.name();

      const isPut = await ssov.isPut();
      const assetName = await ssov.underlyingSymbol();

      const epoch = data.userSSOVOptionBalance[i].epoch;

      try {
        // if not exists then it has been withdrawn
        const owner = await ssov.ownerOf(tokenId);

        const epochData = await ssov.getEpochData(epoch);

        let settlementPrice = epochData['settlementPrice'];

        if (settlementPrice.eq(0))
          settlementPrice = await ssov.getUnderlyingPrice();

        const strike = data.userSSOVOptionBalance[i].strike;

        const amount = data.userSSOVOptionBalance[i].amount;

        const pnl =
          Math.abs(
            getUserReadableAmount(strike, 8) -
              getUserReadableAmount(settlementPrice, 8)
          ) * getUserReadableAmount(amount, 18);

        positions.push({
          epoch: data.userSSOVOptionBalance[i].epoch,
          strike: strike,
          amount: amount,
          fee: data.userSSOVOptionBalance[i].fee,
          premium: data.userSSOVOptionBalance[i].premium,
          pnl: String(pnl),
          ssovAddress: ssovAddress,
          assetName: assetName,
          isPut: isPut,
          ssovName: ssovName,
          link: getLinkFromVaultName(ssovName),
          vaultType: 'SSOV',
          expiry: format(
            new Date(Number(epochData.expiry) * 1000),
            'd LLL yyyy'
          ).toLocaleUpperCase(),
          owner: owner,
        });
      } catch (err) {
        console.log(err);
      }
    }

    // Straddles

    const straddlesQueryResult: ApolloQueryResult<GetUserStraddlesDataQuery> =
      await portfolioStraddlesGraphClient.query({
        query: GetUserStraddlesDataDocument,
        variables: { user: accountAddress.toLowerCase() },
        fetchPolicy: 'no-cache',
      });

    const straddlesData: any = straddlesQueryResult['data']['users'][0];

    const straddlesDeposits: UserStraddlesDeposit[] = [];
    const straddlesPositions: UserStraddlesPosition[] = [];

    for (let i in straddlesData?.userOpenStraddles) {
      const id = straddlesData?.userOpenStraddles[i].id;
      const vaultAddress = id.split('#')[0];
      // const tokenId = id.split('#')[1];

      const vault = AtlanticStraddle__factory.connect(vaultAddress, provider);
      const vaultName = await vault.symbol();
      const assetName = vaultName.split('-')[0]!;

      try {
        straddlesPositions.push({
          assetName: assetName,
          vaultName: vaultName,
          amount: straddlesData?.userOpenStraddles[i].amount,
          epoch: straddlesData?.userOpenStraddles[i].epoch,
          strikePrice: straddlesData?.userOpenStraddles[i].strikePrice,
          underlyingPurchased:
            straddlesData?.userOpenStraddles[i].underlyingPurchased,
          link: '/straddles/' + assetName.toUpperCase(),
          vaultType: 'straddles',
          owner: accountAddress,
        });
      } catch (err) {
        console.log(err);
      }
    }

    for (let i in straddlesData?.userOpenDeposits) {
      const id = straddlesData?.userOpenDeposits[i].id;
      const vaultAddress = id.split('#')[0];
      // const tokenId = id.split('#')[1];

      const vault = AtlanticStraddle__factory.connect(vaultAddress, provider);
      const vaultName = await vault.symbol();
      const assetName = vaultName.split('-')[0]!;

      try {
        straddlesDeposits.push({
          assetName: assetName,
          vaultName: vaultName,
          amount: straddlesData?.userOpenDeposits[i].amount,
          epoch: straddlesData?.userOpenDeposits[i].epoch,
          rollOver: straddlesData?.userOpenDeposits[i].rollOver,
          link: '/straddles/' + assetName.toUpperCase(),
          vaultType: 'straddles',
          owner: accountAddress,
        });
      } catch (err) {
        console.log(err);
      }
    }

    setPortfolioData({
      userSSOVDeposits: deposits,
      userSSOVPositions: positions,
      userStraddlesDeposits: straddlesDeposits,
      userStraddlesPositions: straddlesPositions,
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
