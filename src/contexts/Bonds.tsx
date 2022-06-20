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

import useSendTx from 'hooks/useSendTx';

interface DpxBondsData {
  epochNumber: number;
  epochExpiry: number;
  depositPerNft: number;
  epochStartTime: number;
  maxDepositsPerEpoch: number;
  epochDiscount: number;
  depositUSDC: Function;
}

interface DpxBondsContextInterface extends DpxBondsData {}

const initialData = {
  epochNumber: '3',
  epochExpiry: null,
  depositPerNft: '',
  epochStartTime: null,
  maxDepositsPerEpoch: 0,
  dopexBondsNftBalance: 9,
  dopexBridgoorNFTBalance: 0,
  usdcBalance: 0,
  dpxPrice: 0,
  dpxBondsAddress: '',
  epochDiscount: 0,
  depositUSDC: () => {},
};

export const DpxBondsContext =
  createContext<DpxBondsContextInterface>(initialData);

export const DpxBondsProvider = (props) => {
  const sendTx = useSendTx();

  const [state, setState] = useState(initialData);
  const { accountAddress, provider, signer } = useContext(WalletContext);

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

  const getEpochData = async () => {
    let dopexBridgoorNFTBalance = parseInt(
      await dopexBridgoorNFTContract.balanceOf(accountAddress)
    );
    let usdcBalance = parseInt(await usdcContract.balanceOf(accountAddress));
    let epochNumber = parseInt(await bondsContract.epochNumber());
    let dpxPrice = parseInt(await bondsContract.dpxPrice(epochNumber));
    let epochDiscount = parseInt(
      await bondsContract.epochDiscount(epochNumber)
    );
    let epochStartTime = (await bondsContract.startTime()) * 1000;
    let epochExpiry = parseInt(await bondsContract.epochExpiry(1)) * 1000;
    let usableNfts = (await bondsContract.getUsableNfts(accountAddress)).map(
      (nftId) => parseInt(nftId)
    );
    let maxDepositsPerEpoch = parseInt(
      await bondsContract.maxDepositsPerEpoch(epochNumber)
    );
    let dopexBondsNftBalance = parseInt(
      await bondsContract.getDopexBondsNftBalance(accountAddress)
    );

    const depositUSDC = async (value) => {
      let nftsToDeposit = usableNfts.slice(0, value / 5000);
      console.log('Deposit', value, nftsToDeposit, usableNfts);
      await sendTx(
        usdcContract.approve(
          bondsContract.address,
          nftsToDeposit.length * 10 ** 6 * 5000
        )
      );
      // await usdcContract.approve( bondsContract.address, (nftsToDeposit.length * 10 ** 6)*5000);
      await sendTx(bondsContract.mint(nftsToDeposit));
    };
    // let maxDepositsPerEpoch = parseInt(await bondsContract.maxDepositsPerEpoch(epochNumber))

    console.log('usableNfts, userDeposit', usableNfts);

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
