// @ts-nocheck TODO: FIX
import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import abi from '../pages/Bonds/abi.json';
import dopexBridgoorNFTAbi from '../pages/Bonds/dopexBridgoorNFT.json';
import usdcAbi from '../pages/Bonds/usdc.json';
import { BigNumber, ethers } from 'ethers';
import { WalletContext } from './Wallet';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import useSendTx from 'hooks/useSendTx';

interface bondsState {
  epoch: number;
  issued: number;
  maturityTime: number;
}
interface DpxBondsData {
  epochNumber: number;
  epochExpiry: number;
  epochStartTime: number;
  maxDepositsPerEpoch: number;
  dopexBridgoorNFTBalance: number;
  epochDiscount: number;
  usdcBalance: number;
  dpxBondsAddress: string;
  dpxPrice: number;
  depositUSDC: Function;
  dopexBondsNftBalance: number;
  userDpxBondsState: bondsState[];
  totalEpochDeposits: number;
  bondsDpx: number;
  usableNfts: Array;
  bridgoorNFTIds: Array;
  getDepositsPerNftId: Function;
}

interface DpxBondsContextInterface extends DpxBondsData {}

const initialData = {
  epochNumber: 0,
  epochExpiry: null,
  epochStartTime: null,
  maxDepositsPerEpoch: 0,
  dopexBondsNftBalance: 9,
  dopexBridgoorNFTBalance: 0,
  usdcBalance: 0,
  dpxPrice: 0,
  dpxBondsAddress: '',
  epochDiscount: 0,
  depositUSDC: () => {},
  totalEpochDeposits: 0,
  userDpxBondsState: [],
  usableNfts: [],
  bridgoorNFTIds: [],
  getDepositsPerNftId: () => {},
};

export const DpxBondsContext =
  createContext<DpxBondsContextInterface>(initialData);

export const DpxBondsProvider = (props) => {
  const sendTx = useSendTx();

  const [state, setState] = useState(initialData);
  const { accountAddress, provider, signer, ensAvatar, ensName } =
    useContext(WalletContext);

  const bondsContract = useMemo(() => {
    return new ethers.Contract(
      '0xdA0Fb91C9b6eD017c9e2C21dA8133bf79B73B178',
      abi,
      signer
    );
  }, [signer]);

  const dopexBridgoorNFTContract = useMemo(() => {
    return new ethers.Contract(
      '0x83C9D349501bB53e95b99EBF6538d4a867De9953',
      dopexBridgoorNFTAbi,
      signer
    );
  }, [signer]);

  const usdcContract = useMemo(() => {
    return new ethers.Contract(
      '0x83EccfFc332c3bbEdc2F2473fFF8dc408FD36C16',
      usdcAbi,
      signer
    );
  }, [signer]);

  const getBridgoorNFTIds = async (dopexBridgoorNFTBalance) => {
    let bridgoorIds = [];
    for (let i = 0; i < dopexBridgoorNFTBalance; i++) {
      bridgoorIds.push(
        parseInt(
          await dopexBridgoorNFTContract.tokenOfOwnerByIndex(accountAddress, i)
        )
      );
    }
    return bridgoorIds;
  };

  const getBondsById = async (dopexBondsNftBalance) => {
    let bondsIds = [];
    for (let i = 0; i < dopexBondsNftBalance; i++) {
      bondsIds.push(
        parseInt(await bondsContract.tokenOfOwnerByIndex(accountAddress, i))
      );
    }
    return bondsIds;
  };

  const getUserBondsNftsState = async (bondsIds) => {
    let userBondsState = [];
    for (let i = 0; i < bondsIds.length; i++) {
      let userBond = await bondsContract.nftsState(bondsIds[i]);
      userBondsState.push({
        epoch: parseInt(userBond.epoch),
        issued: parseInt(userBond.issued),
        maturityTime: parseInt(userBond.maturityTime),
      });
    }
    return userBondsState;
  };

  const getEpochData = async () => {
    const dopexBridgoorNFTBalance = parseInt(
      await dopexBridgoorNFTContract.balanceOf(accountAddress)
    );
    const usdcBalance = parseInt(await usdcContract.balanceOf(accountAddress));
    const epochNumber = parseInt(await bondsContract.epochNumber());
    const dpxPrice = parseInt(await bondsContract.dpxPrice(epochNumber));
    const epochDiscount = parseInt(
      await bondsContract.epochDiscount(epochNumber)
    );
    const epochStartTime = (await bondsContract.startTime()) * 1000;
    const epochExpiry = parseInt(await bondsContract.epochExpiry(1)) * 1000;
    const totalEpochDeposits = parseInt(
      await bondsContract.totalEpochDeposits(epochNumber)
    );
    const usableNfts = (await bondsContract.getUsableNfts(accountAddress)).map(
      (nftId) => parseInt(nftId)
    );
    const maxDepositsPerEpoch = parseInt(
      await bondsContract.maxDepositsPerEpoch(epochNumber)
    );
    const dopexBondsNftBalance = parseInt(
      await bondsContract.getDopexBondsNftBalance(accountAddress)
    );
    const dopexBondsIds = await getBondsById(dopexBondsNftBalance);

    const depositUSDC = async (value) => {
      let nftsToDeposit = usableNfts.slice(0, value / 5000);
      await sendTx(
        usdcContract.approve(
          bondsContract.address,
          nftsToDeposit.length * 10 ** 6 * 5000
        )
      );
      await sendTx(bondsContract.mint(nftsToDeposit));
    };

    const userDpxBondsState = await getUserBondsNftsState(dopexBondsIds);
    const bondsDpx = parseInt(
      (maxDepositsPerEpoch * 10 ** 18) /
        ((dpxPrice * (100 - epochDiscount)) / 100)
    );

    const bridgoorNFTIds = await getBridgoorNFTIds(dopexBridgoorNFTBalance);

    const getDepositsPerNftId = async (id: number) =>
      parseInt(await bondsContract.depositsPerNftId(epochNumber, id));

    setState((prevState: any) => ({
      ...prevState,
      epochNumber: epochNumber,
      epochExpiry: epochExpiry,
      epochStartTime: epochStartTime,
      maxDepositsPerEpoch: maxDepositsPerEpoch,
      dopexBondsNftBalance: dopexBondsNftBalance,
      dopexBridgoorNFTBalance: dopexBridgoorNFTBalance,
      usdcBalance: usdcBalance,
      dpxPrice: dpxPrice,
      dpxBondsAddress: bondsContract.address,
      epochDiscount: epochDiscount,
      depositUSDC: depositUSDC,
      getDepositsPerNftId: getDepositsPerNftId,
      totalEpochDeposits: totalEpochDeposits,
      bondsDpx: bondsDpx,
      dopexBondsIds: dopexBondsIds,
      userDpxBondsState: userDpxBondsState,
      usableNfts: usableNfts,
      bridgoorNFTIds: bridgoorNFTIds,
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
