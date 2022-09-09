import {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { BigNumber, ethers } from 'ethers';
import {
  ERC20__factory,
  BaseNFT__factory,
  // DPXBonds__factory,
  // DPXBonds,
  BaseNFT,
} from '@dopex-io/sdk';

import { WalletContext } from './Wallet';
import { AssetsContext } from './Assets';

import useSendTx from 'hooks/useSendTx';
import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';

import { DPXBonds } from 'constants/abi/DPXBonds.js';

interface BondState {
  epoch: number;
  issued: number;
  maturityTime: number;
  redeemed: boolean;
}

interface DpxBondsData {
  epoch: number;
  epochExpiry: number;
  maxDepositsPerEpoch: BigNumber;
  dpxPrice: BigNumber;
  dpxBondsAddress: string;
  bridgoorNftBalance: BigNumber;
  usdcBalance: BigNumber;
  bridgoorNftIds: number[];
}

const initialDpxBondsData = {
  epoch: 0,
  epochExpiry: 0,
  maxDepositsPerEpoch: BigNumber.from(0),
  dpxPrice: BigNumber.from(0),
  dpxBondsAddress: '',
  bridgoorNftBalance: BigNumber.from(0),
  usdcBalance: BigNumber.from(0),
  bridgoorNftIds: [],
};

interface DopexBondsUserEpochData {
  usableNfts: BigNumber[];
  userClaimableBonds: BigNumber[];
  userBondsBalance: BigNumber;
  userDpxBondsState: BondState[];
}

const initialDopexBondsUserEpochData = {
  usableNfts: [],
  userClaimableBonds: [],
  userBondsBalance: BigNumber.from(0),
  userDpxBondsState: [],
};

interface DopexBondsEpochData {
  epoch: number;
  epochExpiry: number;
  dpxBalance: BigNumber;
  totalEpochDeposits: BigNumber;
  bondPrice: BigNumber;
  bondsIssued: BigNumber;
  depositPerNft: BigNumber;
}

const initialBondsEpochData = {
  dpxBalance: BigNumber.from(0),
  totalEpochDeposits: BigNumber.from(0),
  epoch: 0,
  epochExpiry: 0,
  bondPrice: BigNumber.from(0),
  bondsIssued: BigNumber.from(0),
  depositPerNft: BigNumber.from(0),
};

interface DpxBondsContextInterface {
  dpxBondsData: DpxBondsData;
  dpxBondsEpochData: DopexBondsEpochData;
  dpxBondsUserEpochData: DopexBondsUserEpochData;
  getDepositsPerNftId?: Function;
  updateEpochData?: Function;
  handleMint?: Function;
  handleRedeem?: Function;
}

export const DpxBondsContext = createContext<DpxBondsContextInterface>({
  dpxBondsData: initialDpxBondsData,
  dpxBondsEpochData: initialBondsEpochData,
  dpxBondsUserEpochData: initialDopexBondsUserEpochData,
});

export const DpxBondsProvider = (props: { children: ReactNode }) => {
  const sendTx = useSendTx();

  const [bondsData, setBondsData] = useState<DpxBondsData>(initialDpxBondsData);
  const [epochData, setEpochData] = useState<DopexBondsEpochData>(
    initialBondsEpochData
  );
  const [userEpochData, setUserEpochData] = useState<DopexBondsUserEpochData>(
    initialDopexBondsUserEpochData
  );

  const { accountAddress, signer, provider, contractAddresses } =
    useContext(WalletContext);

  const { tokenPrices } = useContext(AssetsContext);

  const bondsContract: /*DPXBonds | undefined */ any = useMemo(() => {
    if (!signer || !contractAddresses) return;

    return new ethers.Contract(
      '0xb8493A60A6BdF662fe7ddFF9695b3bD1C781A843',
      DPXBonds,
      signer
    );
    // return DPXBonds__factory.connect(contractAddresses['DPXBonds'], signer);
  }, [signer, contractAddresses]);

  const dopexBridgoorNFTContract: BaseNFT | undefined = useMemo(() => {
    if (!provider || !contractAddresses) return;
    return BaseNFT__factory.connect(
      // contractAddresses['NFTS']['DopexBridgoorNFT'],
      '0xc3e49F38fC5000aBD083C5311927e6915F400012', // Mock Bridgoor NFT
      provider
    );
  }, [contractAddresses, provider]);

  const usdcContract = useMemo(() => {
    if (!provider || !contractAddresses) return;
    return ERC20__factory.connect(
      // contractAddresses['USDC'],
      '0x96979F70aDe814fBc53B3cebC5d2fCf3FE8A7381', // Mock USDC
      provider
    );
  }, [contractAddresses, provider]);

  const dpxContract = useMemo(() => {
    if (!provider || !contractAddresses) return;
    return ERC20__factory.connect(
      // contractAddresses['DPX'],
      '0x9deAB090eba517ef04842F1D6bB423151E3b7D19', // Mock DPX
      provider
    );
  }, [contractAddresses, provider]);

  const getBridgoorNftIds = useCallback(
    async (dopexBridgoorNFTBalance: number) => {
      if (!dopexBridgoorNFTContract) return;

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
    },
    [accountAddress, dopexBridgoorNFTContract]
  );

  const getBondsById = useCallback(
    async (dopexBondsNftBalance: BigNumber) => {
      if (!bondsContract) return;

      let bondsIds = [];
      for (let i = 0; i < dopexBondsNftBalance.toNumber(); i++) {
        accountAddress &&
          bondsIds.push(
            Number(
              await bondsContract['tokenOfOwnerByIndex'](accountAddress, i)
            )
          );
      }
      return bondsIds;
    },
    [accountAddress, bondsContract]
  );

  const getUserBondsNftsState = useCallback(
    async (bondsIds: Array<number>) => {
      if (!bondsContract || !bondsIds) return;
      let userBondsState = [];
      for (let i = 0; i < bondsIds.length; i++) {
        let userBond = await bondsContract['nftsState'](bondsIds[i]!);
        userBondsState.push({
          epoch: Number(userBond.epoch),
          issued: Number(userBond.issued),
          maturityTime: Number(userBond.maturityTime),
          redeemed: userBond.redeemed,
        });
      }
      return userBondsState;
    },
    [bondsContract]
  );

  const updateBondsData = useCallback(async () => {
    if (
      !contractAddresses ||
      !bondsContract ||
      !usdcContract ||
      !dopexBridgoorNFTContract ||
      !accountAddress ||
      !tokenPrices
    )
      return;

    const currentEpoch = await bondsContract.currentEpoch();

    const epochExpiry = await bondsContract.epochExpiry(currentEpoch);

    const maxDepositsPerEpoch = await bondsContract.maxDepositsPerEpoch(
      currentEpoch
    );

    const bridgoorNftBalance = await dopexBridgoorNFTContract.balanceOf(
      accountAddress
    );

    const usdcBalance = await usdcContract.balanceOf(accountAddress);

    const dpxBondsAddress = bondsContract.address;

    const dpxCgPrice =
      tokenPrices.find((token) => token.name === 'DPX')?.price ?? 0;

    const dpxPrice = getContractReadableAmount(dpxCgPrice, 6);

    const bridgoorNftIds =
      (await getBridgoorNftIds(bridgoorNftBalance.toNumber())) ?? [];

    const _bondsData = {
      epoch: Number(currentEpoch),
      epochExpiry: Number(epochExpiry),
      dpxPrice,
      maxDepositsPerEpoch,
      dpxBondsAddress,
      bridgoorNftBalance,
      usdcBalance,
      bridgoorNftIds,
    };
    setBondsData(_bondsData);
  }, [
    accountAddress,
    bondsContract,
    contractAddresses,
    dopexBridgoorNFTContract,
    getBridgoorNftIds,
    tokenPrices,
    usdcContract,
  ]);

  const updateEpochData = useCallback(
    async (selectedEpoch: number) => {
      if (!bondsContract || !dopexBridgoorNFTContract || !usdcContract) return;

      const totalUsdcLocked = await bondsContract.totalEpochDeposits(
        selectedEpoch
      );
      const contractDpxBalance = await dpxContract?.balanceOf(
        bondsContract.address
      );

      const bondPrice: BigNumber = await bondsContract.epochBondPrice(
        selectedEpoch
      ); // 1e6 precision

      const expiry = await bondsContract.epochExpiry(selectedEpoch);

      const depositPerNft = await bondsContract.epochDepositPerNft(
        selectedEpoch
      );

      const maxDepositsPerEpoch = await bondsContract.maxDepositsPerEpoch(
        selectedEpoch
      );

      if (bondPrice.eq(0) || maxDepositsPerEpoch.eq(0)) return;

      let bonds = BigNumber.from(0);

      bonds = totalUsdcLocked
        ?.mul(getContractReadableAmount(1, 18))
        .div(bondPrice);

      const _epochData: DopexBondsEpochData = {
        epoch: selectedEpoch,
        epochExpiry: Number(expiry),
        dpxBalance: contractDpxBalance ?? BigNumber.from(0),
        totalEpochDeposits: totalUsdcLocked,
        bondsIssued: bonds,
        bondPrice: bondPrice,
        depositPerNft: depositPerNft,
      };

      setEpochData(_epochData);
    },
    [bondsContract, dopexBridgoorNFTContract, dpxContract, usdcContract]
  );

  const updateUserEpochData = useCallback(async () => {
    if (
      !bondsContract ||
      !dopexBridgoorNFTContract ||
      !usdcContract ||
      !accountAddress
    )
      return;

    const currentEpoch = await bondsContract.currentEpoch();

    const usableNfts = await bondsContract.getUsableNfts(accountAddress);

    const userClaimableBonds = await bondsContract.getRedeemableBonds(
      accountAddress,
      currentEpoch
    );

    const userBondsBalance = await bondsContract.balanceOf(accountAddress);

    const dopexBondsIds =
      (userBondsBalance && (await getBondsById(userBondsBalance))) ?? [];

    let userEpochBondsState: BondState[] = [];

    if (dopexBondsIds.length > 0) {
      userEpochBondsState = (await getUserBondsNftsState(dopexBondsIds)) ?? [];
    }

    const _userEpochData = {
      usableNfts,
      userClaimableBonds,
      userBondsBalance,
      userDpxBondsState: userEpochBondsState,
    };

    setUserEpochData(_userEpochData);
  }, [
    accountAddress,
    bondsContract,
    dopexBridgoorNFTContract,
    getBondsById,
    getUserBondsNftsState,
    usdcContract,
  ]);

  const handleMint = useCallback(async () => {
    if (!bondsContract || !signer || userEpochData.usableNfts.length === 0)
      return;

    try {
      await sendTx(
        bondsContract?.connect(signer).mint(userEpochData.usableNfts)
      );
    } catch (e) {
      console.log(e);
    }
  }, [bondsContract, sendTx, signer, userEpochData]);

  const handleRedeem = useCallback(
    async (epoch: number) => {
      if (
        !bondsContract ||
        !signer ||
        userEpochData.userClaimableBonds.length < 1
      )
        return;

      try {
        await sendTx(bondsContract.connect(signer).redeem(epoch));
      } catch (e) {
        console.log(e);
      }
    },
    [bondsContract, sendTx, signer, userEpochData.userClaimableBonds.length]
  );

  useEffect(() => {
    updateBondsData();
  }, [updateBondsData]);

  useEffect(() => {
    updateUserEpochData();
  }, [updateUserEpochData]);

  const getDepositsPerNftId = useCallback(
    async (id: number, epoch: number) => {
      if (!bondsContract) return;
      return Number(await bondsContract['depositsPerNftId'](epoch, id));
    },
    [bondsContract]
  );

  let contextValue = {
    dpxBondsEpochData: epochData,
    dpxBondsUserEpochData: userEpochData,
    dpxBondsData: bondsData,
    getDepositsPerNftId,
    updateEpochData,
    handleMint,
    handleRedeem,
  };

  return (
    <DpxBondsContext.Provider value={contextValue}>
      {props.children}
    </DpxBondsContext.Provider>
  );
};
