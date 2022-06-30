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

  const getEpochData = async () => {
    const epochNumber = Number(await bondsContract['epochNumber']());
    const epochExpiry =
      Number(await bondsContract['epochExpiry'](epochNumber)) * 1000;
    const totalEpochDeposits = Number(
      await bondsContract['totalEpochDeposits'](epochNumber)
    );
    const maxDepositsPerEpoch = Number(
      await bondsContract['maxDepositsPerEpoch'](epochNumber)
    );

    const usdcContractBalance = Number(
      await usdcContract['balanceOf'](bondsContract.address)
    );
    const dpxPrice = Number(await bondsContract['dpxPrice'](epochNumber));
    const epochDiscount = Number(
      await bondsContract['epochDiscount'](epochNumber)
    );
    const bondsDpx =
      (maxDepositsPerEpoch * 10 ** 18) /
      ((dpxPrice * (100 - epochDiscount)) / 100);

    const depositPerNft =
      Number(await bondsContract['depositPerNft']()) / 10 ** 6;

    setState((prevState: any) => ({
      ...prevState,
      epochNumber: epochNumber,
      epochExpiry: epochExpiry,
      totalEpochDeposits: totalEpochDeposits,
      maxDepositsPerEpoch: maxDepositsPerEpoch,
      usdcContractBalance: usdcContractBalance,
      dpxPrice: dpxPrice,
      epochDiscount: epochDiscount,
      bondsDpx: bondsDpx,
      depositPerNft: depositPerNft,
    }));
  };

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
      accountAddress &&
        bondsIds.push(
          Number(await bondsContract['tokenOfOwnerByIndex'](accountAddress, i))
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

  const getEpochUserData = async () => {
    const dopexBridgoorNFTBalance =
      accountAddress &&
      Number(await dopexBridgoorNFTContract['balanceOf'](accountAddress));
    const usdcBalance =
      accountAddress && Number(await usdcContract['balanceOf'](accountAddress));

    const usableNfts =
      accountAddress &&
      (await bondsContract['getUsableNfts'](accountAddress)).map((nftId) =>
        Number(nftId)
      );

    const dopexBondsNftBalance =
      accountAddress &&
      Number(await bondsContract['getDopexBondsNftBalance'](accountAddress));

    const dopexBondsIds =
      dopexBondsNftBalance && (await getBondsById(dopexBondsNftBalance));

    const depositUSDC = async (value: number) => {
      let nftsToDeposit = usableNfts?.slice(0, value / state.depositPerNft);
      if (nftsToDeposit) {
        await sendTx(
          usdcContract['approve'](
            bondsContract.address,
            nftsToDeposit.length * 10 ** 6 * state.depositPerNft
          )
        );
        // @ts-ignore TODO: FIX
        await sendTx(bondsContract['mint'](nftsToDeposit));
      }
    };

    const withdrawDpx = async () => {
      await sendTx(bondsContract['redeem'](state.epochNumber));
    };

    const userDpxBondsState =
      dopexBondsIds && (await getUserBondsNftsState(dopexBondsIds));
    const bondsDpx =
      (state.maxDepositsPerEpoch * 10 ** 18) /
      ((state.dpxPrice * (100 - state.epochDiscount)) / 100);
    const bridgoorNFTIds =
      dopexBridgoorNFTBalance &&
      (await getBridgoorNFTIds(dopexBridgoorNFTBalance));

    const getDepositsPerNftId = async (id: number) =>
      Number(await bondsContract['depositsPerNftId'](state.epochNumber, id));

    setState((prevState: any) => ({
      ...prevState,
      dopexBondsNftBalance: dopexBondsNftBalance,
      dopexBridgoorNFTBalance: dopexBridgoorNFTBalance,
      usdcBalance: usdcBalance,
      dpxBondsAddress: bondsContract.address,
      bondsDpx: bondsDpx,
      dopexBondsIds: dopexBondsIds,
      userDpxBondsState: userDpxBondsState,
      usableNfts: usableNfts,
      bridgoorNFTIds: bridgoorNFTIds,
      depositUSDC: depositUSDC,
      getDepositsPerNftId: getDepositsPerNftId,
      withdrawDpx: withdrawDpx,
    }));
  };

  useEffect(() => {
    signer && getEpochUserData();
  }, [signer, state.epochNumber]);

  useEffect(() => {
    provider && getEpochData();
  }, [provider]);

  return (
    <DpxBondsContext.Provider value={state}>
      {props.children}
    </DpxBondsContext.Provider>
  );
};
