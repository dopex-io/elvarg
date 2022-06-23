// @ts-nocheck TODO: FIX
import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { BigNumber, ethers } from 'ethers';
import { WalletContext } from './Wallet';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import useSendTx from 'hooks/useSendTx';

import abi from '../pages/Bonds/abi/abi.json';
import dopexBridgoorNFTAbi from '../pages/Bonds/abi/dopexBridgoorNFT.json';
import usdcAbi from '../pages/Bonds/abi/usdc.json';

interface bondsState {
  epoch: number;
  issued: number;
  maturityTime: number;
  redeemed: boolean;
}
interface DpxBondsData {
  epochNumber: number;
  epochExpiry: number;
  //   epochStartTime: number;
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
  usdcContractBalance: number;
  withdrawDpx: Function;
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
  withdrawDpx: () => {},
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
      '0x05904287ccA5B9eE233c177BAAbe97A0b15ADA21',
      abi,
      signer
    );
  }, [signer]);

  const dopexBridgoorNFTContract = useMemo(() => {
    return new ethers.Contract(
      '0x6C51C3CC0F5Af833bDC0F6A8a33E468fFB755CDd',
      dopexBridgoorNFTAbi,
      signer
    );
  }, [signer]);

  const usdcContract = useMemo(() => {
    return new ethers.Contract(
      '0xF31dBc6e1eB12764B0F0eb4C4CfA3F0a42e0caEF',
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
        redeemed: userBond.redeemed,
      });
    }
    return userBondsState;
  };

  const getEpochData = async () => {
    const dopexBridgoorNFTBalance = parseInt(
      await dopexBridgoorNFTContract.balanceOf(accountAddress)
    );
    const usdcBalance = parseInt(await usdcContract.balanceOf(accountAddress));
    const usdcContractBalance = parseInt(
      await usdcContract.balanceOf(bondsContract.address)
    );
    const epochNumber = parseInt(await bondsContract.epochNumber());
    const dpxPrice = parseInt(await bondsContract.dpxPrice(epochNumber));
    const epochDiscount = parseInt(
      await bondsContract.epochDiscount(epochNumber)
    );
    // const epochStartTime = (await bondsContract.startTime()) * 1000;
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

    const withdrawableNftsForSelectedEpoch = async () => {
      return await bondsContract.getWithdrawableNftsForSelectedEpoch(
        accountAddress,
        epochNumber
      );
    };

    const withdrawDpx = async () => {
      await sendTx(bondsContract.redeem(epochNumber));
    };

    const userDpxBondsState = await getUserBondsNftsState(dopexBondsIds);
    const bondsDpx = parseInt(
      (maxDepositsPerEpoch * 10 ** 18) /
        ((dpxPrice * (100 - epochDiscount)) / 100)
    );
    console.log('bondsDpx', bondsDpx, totalEpochDeposits);
    const bridgoorNFTIds = await getBridgoorNFTIds(dopexBridgoorNFTBalance);

    const getDepositsPerNftId = async (id: number) =>
      parseInt(await bondsContract.depositsPerNftId(epochNumber, id));

    setState((prevState: any) => ({
      ...prevState,
      epochNumber: epochNumber,
      epochExpiry: epochExpiry,
      //   epochStartTime: epochStartTime,
      maxDepositsPerEpoch: maxDepositsPerEpoch,
      dopexBondsNftBalance: dopexBondsNftBalance,
      dopexBridgoorNFTBalance: dopexBridgoorNFTBalance,
      usdcBalance: usdcBalance,
      usdcContractBalance: usdcContractBalance,
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
      withdrawDpx: withdrawDpx,
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
