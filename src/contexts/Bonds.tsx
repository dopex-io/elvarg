import {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';

import { ethers } from 'ethers';
import { WalletContext } from './Wallet';
import useSendTx from 'hooks/useSendTx';
// @ts-ignore TODO: FIX
import abi from '../components/more/Bonds/abi/bonds.json';
// @ts-ignore TODO: FIX
import dopexBridgoorNFTAbi from '../components/more/Bonds/abi/dopexBridgoorNFT.json';
// @ts-ignore TODO: FIX
import usdcAbi from '../components/more/Bonds/abi/usdc.json';

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
  const { accountAddress, signer } = useContext(WalletContext);

  const bondsContract = useMemo(() => {
    return new ethers.Contract(
      '0x83EccfFc332c3bbEdc2F2473fFF8dc408FD36C16',
      abi,
      signer
    );
  }, [signer]);

  const dopexBridgoorNFTContract = useMemo(() => {
    return new ethers.Contract(
      '0x4Ee9fe9500E7C4Fe849AdD9b14beEc5eC5b7d955',
      dopexBridgoorNFTAbi,
      signer
    );
  }, [signer]);

  const usdcContract = useMemo(() => {
    return new ethers.Contract(
      '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      usdcAbi,
      signer
    );
  }, [signer]);

  const getBridgoorNFTIds = async (dopexBridgoorNFTBalance: number) => {
    let bridgoorIds = [];
    for (let i = 0; i < dopexBridgoorNFTBalance; i++) {
      bridgoorIds.push(
        parseInt(
          await dopexBridgoorNFTContract['tokenOfOwnerByIndex'](
            accountAddress,
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
        parseInt(await bondsContract['tokenOfOwnerByIndex'](accountAddress, i))
      );
    }
    return bondsIds;
  };

  const getUserBondsNftsState = async (bondsIds: Array<number>) => {
    let userBondsState = [];
    for (let i = 0; i < bondsIds.length; i++) {
      let userBond = await bondsContract['nftsState'](bondsIds[i]);
      userBondsState.push({
        epoch: parseInt(userBond.epoch),
        issued: parseInt(userBond.issued),
        maturityTime: parseInt(userBond.maturityTime),
        redeemed: userBond.redeemed,
      });
    }
    return userBondsState;
  };

  const getEpochData = async () => {
    const dopexBridgoorNFTBalance = parseInt(
      await dopexBridgoorNFTContract['balanceOf'](accountAddress)
    );
    const usdcBalance = parseInt(
      await usdcContract['balanceOf'](accountAddress)
    );
    const usdcContractBalance = parseInt(
      await usdcContract['balanceOf'](bondsContract.address)
    );
    const epochNumber = parseInt(await bondsContract['epochNumber']());
    const dpxPrice = parseInt(await bondsContract['dpxPrice'](epochNumber));
    const epochDiscount = parseInt(
      await bondsContract['epochDiscount'](epochNumber)
    );
    const epochExpiry =
      parseInt(await bondsContract['epochExpiry'](epochNumber)) * 1000;
    const totalEpochDeposits = parseInt(
      await bondsContract['totalEpochDeposits'](epochNumber)
    );
    const usableNfts = (
      await bondsContract['getUsableNfts'](accountAddress)
    ).map((nftId: number) => Number(nftId));
    const maxDepositsPerEpoch = parseInt(
      await bondsContract['maxDepositsPerEpoch'](epochNumber)
    );
    const dopexBondsNftBalance = parseInt(
      await bondsContract['getDopexBondsNftBalance'](accountAddress)
    );
    const dopexBondsIds = await getBondsById(dopexBondsNftBalance);

    const depositPerNft =
      parseInt(await bondsContract['depositPerNft']()) / 10 ** 6;

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
      parseInt(await bondsContract['depositsPerNftId'](epochNumber, id));

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
