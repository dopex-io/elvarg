import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';

import { WalletContext } from './Wallet';
import useSendTx from 'hooks/useSendTx';

import {
  Addresses,
  ERC20__factory,
  BaseNFT__factory,
  DPXBonds__factory,
} from '@dopex-io/sdk';

interface bondsState {
  epoch: number;
  issued: number;
  maturityTime: number;
  redeemed: boolean;
}
interface DpxBondsData {
  epochNumber: number;
  epochExpiry: number;
  maxDepositsPerEpoch: number;
  dopexBridgoorNFTBalance: number;
  dopexBondsNftBalance: number;
  epochDiscount: number;
  usdcBalance: number;
  dpxBondsAddress: string;
  dpxPrice: number;
  userDpxBondsState: bondsState[];
  totalEpochDeposits: number;
  bondsDpx: number;
  usableNfts: Array<number>;
  bridgoorNFTIds: Array<number>;
  usdcContractBalance: number;
  depositUSDC: Function;
  getDepositsPerNftId: Function;
  withdrawDpx: Function;
  depositPerNft: number;
}
interface DpxBondsContextInterface extends DpxBondsData {}

const initialData = {
  epochNumber: 0,
  epochExpiry: 0,
  maxDepositsPerEpoch: 0,
  dopexBridgoorNFTBalance: 0,
  dopexBondsNftBalance: 0,
  epochDiscount: 0,
  usdcBalance: 0,
  dpxBondsAddress: '',
  dpxPrice: 0,
  totalEpochDeposits: 0,
  bondsDpx: 0,
  userDpxBondsState: [],
  usableNfts: [],
  bridgoorNFTIds: [],
  usdcContractBalance: 0,
  depositUSDC: () => {},
  getDepositsPerNftId: () => {},
  withdrawDpx: () => {},
  depositPerNft: 0,
};

export const DpxBondsContext =
  createContext<DpxBondsContextInterface>(initialData);

export const DpxBondsProvider = (props: { children: ReactNode }) => {
  const sendTx = useSendTx();
  const [state, setState] = useState(initialData);
  const { accountAddress, signer, chainId, provider } =
    useContext(WalletContext);

  const bondsContract = DPXBonds__factory.connect(
    Addresses[chainId].DPXBonds,
    provider
  );

  const dopexBridgoorNFTContract = BaseNFT__factory.connect(
    Addresses[chainId].NFTS.DopexBridgoorNFT,
    provider
  );

  const usdcContract = ERC20__factory.connect(
    Addresses[chainId].USDC,
    provider
  );

  const getBridgoorNFTIds = async (dopexBridgoorNFTBalance: number) => {
    let bridgoorIds = [];
    for (let i = 0; i < dopexBridgoorNFTBalance; i++) {
      bridgoorIds.push(
        Number(
          await dopexBridgoorNFTContract['tokenOfOwnerByIndex'](
            accountAddress || '',
            i
          )
        )
      );
    }
    return bridgoorIds;
  };

  const getBondsById = async (dopexBondsNftBalance: number) => {
    let bondsIds = [];
    for (let i = 0; i < dopexBondsNftBalance; i++) {
      bondsIds.push(
        Number(
          await bondsContract['tokenOfOwnerByIndex'](accountAddress || '', i)
        )
      );
    }
    return bondsIds;
  };

  const getUserBondsNftsState = async (bondsIds: Array<number>) => {
    let userBondsState = [];

    for (let i = 0; i < bondsIds.length; i++) {
      // @ts-ignore TODO: FIX
      let userBond = await bondsContract['nftsState'](bondsIds[i]);
      userBondsState.push({
        epoch: Number(userBond.epoch),
        issued: Number(userBond.issued),
        maturityTime: Number(userBond.maturityTime),
        redeemed: userBond.redeemed,
      });
    }
    return userBondsState;
  };

  const getEpochData = async () => {
    const dopexBridgoorNFTBalance = Number(
      await dopexBridgoorNFTContract['balanceOf'](accountAddress || '')
    );
    const usdcBalance = Number(
      await usdcContract['balanceOf'](accountAddress || '')
    );
    const usdcContractBalance = Number(
      await usdcContract['balanceOf'](bondsContract.address)
    );
    const epochNumber = Number(await bondsContract['epochNumber']());
    const dpxPrice = Number(await bondsContract['dpxPrice'](epochNumber));
    const epochDiscount = Number(
      await bondsContract['epochDiscount'](epochNumber)
    );
    const epochExpiry =
      Number(await bondsContract['epochExpiry'](epochNumber)) * 1000;
    const totalEpochDeposits = Number(
      await bondsContract['totalEpochDeposits'](epochNumber)
    );

    const usableNfts = (
      await bondsContract['getUsableNfts'](accountAddress || '')
    ).map((nftId) => Number(nftId));

    const maxDepositsPerEpoch = Number(
      await bondsContract['maxDepositsPerEpoch'](epochNumber)
    );
    const dopexBondsNftBalance = Number(
      await bondsContract['getDopexBondsNftBalance'](accountAddress || '')
    );
    const dopexBondsIds = await getBondsById(dopexBondsNftBalance);

    const depositPerNft =
      Number(await bondsContract['depositPerNft']()) / 10 ** 6;

    const depositUSDC = async (value: number) => {
      let nftsToDeposit = usableNfts.slice(0, value / depositPerNft);
      await sendTx(
        usdcContract['approve'](
          bondsContract.address,
          nftsToDeposit.length * 10 ** 6 * depositPerNft
        )
      );
      await sendTx(bondsContract['mint'](nftsToDeposit));
    };

    const withdrawDpx = async () => {
      await sendTx(bondsContract['redeem'](epochNumber));
    };

    const userDpxBondsState = await getUserBondsNftsState(dopexBondsIds);
    const bondsDpx =
      (maxDepositsPerEpoch * 10 ** 18) /
      ((dpxPrice * (100 - epochDiscount)) / 100);
    const bridgoorNFTIds = await getBridgoorNFTIds(dopexBridgoorNFTBalance);

    const getDepositsPerNftId = async (id: number) =>
      Number(await bondsContract['depositsPerNftId'](epochNumber, id));

    setState((prevState: any) => ({
      ...prevState,
      epochNumber: epochNumber,
      epochExpiry: epochExpiry,
      maxDepositsPerEpoch: maxDepositsPerEpoch,
      dopexBondsNftBalance: dopexBondsNftBalance,
      dopexBridgoorNFTBalance: dopexBridgoorNFTBalance,
      usdcBalance: usdcBalance,
      usdcContractBalance: usdcContractBalance,
      dpxPrice: dpxPrice,
      dpxBondsAddress: bondsContract.address,
      epochDiscount: epochDiscount,
      totalEpochDeposits: totalEpochDeposits,
      bondsDpx: bondsDpx,
      dopexBondsIds: dopexBondsIds,
      userDpxBondsState: userDpxBondsState,
      usableNfts: usableNfts,
      bridgoorNFTIds: bridgoorNFTIds,
      depositUSDC: depositUSDC,
      getDepositsPerNftId: getDepositsPerNftId,
      withdrawDpx: withdrawDpx,
      depositPerNft: depositPerNft,
    }));
  };

  useEffect(() => {
    signer && getEpochData();
  }, [signer]);

  return (
    <DpxBondsContext.Provider value={state}>
      {props.children}
    </DpxBondsContext.Provider>
  );
};
