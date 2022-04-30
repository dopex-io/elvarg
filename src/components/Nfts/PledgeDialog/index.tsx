import React, {
  useEffect,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {
  Addresses,
  DiamondPepeNFTs__factory,
  DiamondPepeNFTsPledge,
} from '@dopex-io/sdk';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import EstimatedGasCostButton from 'components/EstimatedGasCostButton';

import { Data, UserData } from 'pages/nfts/diamondpepes/interfaces';

import { WalletContext } from 'contexts/Wallet';
import { AssetsContext } from 'contexts/Assets';

import useSendTx from 'hooks/useSendTx';

import styles from './styles.module.scss';

export interface Props {
  open: boolean;
  handleClose: () => {};
  tab: string;
  data: Data;
  userData: UserData;
  timeRemaining: JSX.Element;
  updateData: () => {};
  updateUserData: () => {};
  pledge: DiamondPepeNFTsPledge;
  winners: any[];
}

const PledgeDialog = ({
  open,
  handleClose,
  data,
  tab,
  userData,
  timeRemaining,
  updateData,
  updateUserData,
  pledge,
  winners,
}: Props) => {
  const { updateAssetBalances, userAssetBalances, tokens, tokenPrices } =
    useContext(AssetsContext);
  const { accountAddress, chainId, signer, provider } =
    useContext(WalletContext);

  const diamondPepeNfts = DiamondPepeNFTs__factory.connect(
    Addresses[chainId]['NFTS']['DiamondPepesNFT'],
    signer
  );
  const [approved, setApproved] = useState<boolean>(false);
  const [isZapInVisible, setIsZapInVisible] = useState<boolean>(false);
  const [rawAmount, setRawAmount] = useState<string>('');
  const [userNfts, setUserNfts] = useState<
    Array<{
      img: string;
      id: string;
    }>
  >([]);
  const [userPledgedNfts, setUserPledgedNfts] = useState<
    Array<{
      img: string;
      id: string;
    }>
  >([]);
  const [selectedNfts, selectNfts] = useState<Array<Number>>([]);
  const amount: number = useMemo(() => {
    return parseFloat(rawAmount) || 0;
  }, [rawAmount]);

  const pepeReserved: number = useMemo(() => {
    return data.mintPrice.gt(0)
      ? Math.floor(Number(userData.deposits.div(data.mintPrice).toString()))
      : 0;
  }, [data, userData]);

  const sendTx = useSendTx();

  const getNfts = useCallback(async () => {
    const nfts = await diamondPepeNfts
      .connect(signer)
      .walletOfOwner(accountAddress);
    let _nfts = [];
    let _pledgedNfts = [];

    const pledged = await Promise.all(nfts.map((n) => pledge.pledged(n)));

    nfts.map((n, i) => {
      if (pledged[i] !== '0x0000000000000000000000000000000000000000')
        _pledgedNfts.push({
          id: n.toString(),
          img: `https://ipfs.io/ipfs/QmZGtzDodjfRTGJErqpJ7oFRJ4GM1R1DZkGPnRYVzZ9ZsC/${n}.png`,
        });
      else
        _nfts.push({
          id: n.toString(),
          img: `https://ipfs.io/ipfs/QmZGtzDodjfRTGJErqpJ7oFRJ4GM1R1DZkGPnRYVzZ9ZsC/${n}.png`,
        });
    });

    setUserNfts(_nfts);
    setUserPledgedNfts(_pledgedNfts);
  }, [accountAddress, diamondPepeNfts, pledge, signer]);

  const [activeTab, setActiveTab] = useState<string>('winner');

  const modalHeight = useMemo(() => {
    if (userPledgedNfts.length > 0 && userNfts.length > 0) return '49.2rem';
    else return '33.2rem';
  }, [userPledgedNfts, userNfts]);

  const handlePledge = useCallback(async () => {
    try {
      const tokenIds: BigNumber[] = [];
      selectedNfts.map((i) =>
        tokenIds.push(BigNumber.from(userNfts[i.toFixed(0)].id))
      );
      await sendTx(pledge.connect(signer).pledge(tokenIds));
      await updateData();
      await updateUserData();
      await getNfts();
      selectNfts([]);
    } catch (err) {
      console.log(err);
    }
  }, [
    selectedNfts,
    sendTx,
    pledge,
    signer,
    updateData,
    updateUserData,
    getNfts,
    userNfts,
  ]);

  const handleApprove = useCallback(async () => {
    try {
      await sendTx(
        diamondPepeNfts.connect(signer).setApprovalForAll(pledge.address, true)
      );
      setApproved(true);
    } catch (err) {
      console.log(err);
    }
  }, [diamondPepeNfts, signer, sendTx, pledge]);

  const handleSelectNft = useCallback(
    async (id) => {
      const _nfts = JSON.parse(JSON.stringify(selectedNfts));
      if (_nfts.indexOf(id) !== -1) _nfts.splice(_nfts.indexOf(id), 1);
      else _nfts.push(id);
      selectNfts(_nfts);
    },
    [selectedNfts]
  );

  // Handles isApproved
  useEffect(() => {
    (async function () {
      const allowance = await diamondPepeNfts
        .connect(signer)
        .isApprovedForAll(accountAddress, pledge.address);
      setApproved(allowance);
    })();
  }, [accountAddress, diamondPepeNfts, pledge, signer]);

  // Get nfts initially
  useEffect(() => {
    getNfts();
  }, [getNfts]);

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      background={'bg-[#181C24]'}
      classes={{
        paper: 'rounded m-0',
        paperScrollPaper: 'overflow-x-hidden',
      }}
    >
      <Box className="flex flex-row items-center mb-4">
        <Typography variant="h5">Diamond Pepes</Typography>
      </Box>

      {['pledge', 'winner'].includes(activeTab) && (
        <Box className={isZapInVisible ? 'hidden' : 'flex'}>
          <Box className={'w-full flex'}>
            <Box
              className={
                'flex flex-row mb-3 justify-between p-1 border-[1px] border-[#232935] rounded-md ' +
                (winners?.length > 0 ? 'w-1/2' : 'w-full')
              }
            >
              <Box
                className={
                  activeTab === 'pledge'
                    ? 'text-center w-full pt-0.5 pb-1 bg-[#343C4D] cursor-pointer group rounded hover:opacity-80'
                    : 'text-center w-full pt-0.5 pb-1 cursor-pointer group rounded hover:opacity-80'
                }
              >
                <Typography
                  variant="h6"
                  className={
                    activeTab === 'pledge'
                      ? 'text-xs font-normal'
                      : 'text-[#78859E] text-xs font-normal'
                  }
                  onClick={() => setActiveTab('pledge')}
                >
                  Pledge
                </Typography>
              </Box>
            </Box>
            {winners?.length > 0 ? (
              <Box className="flex flex-row mb-3 justify-between p-1 border-[1px] border-[#232935] rounded-md w-1/2">
                <Box
                  className={
                    activeTab === 'winner'
                      ? 'text-center w-full pt-0.5 pb-1 bg-[#343C4D] cursor-pointer group rounded hover:opacity-80'
                      : 'text-center w-full pt-0.5 pb-1 cursor-pointer group rounded hover:opacity-80'
                  }
                >
                  <Typography
                    variant="h6"
                    className={
                      activeTab === 'winner'
                        ? 'text-xs font-normal'
                        : 'text-[#78859E] text-xs font-normal'
                    }
                    onClick={() => setActiveTab('winner')}
                  >
                    Winners
                  </Typography>
                </Box>
              </Box>
            ) : null}
          </Box>
        </Box>
      )}

      <Box style={{ height: modalHeight }}>
        {activeTab === 'pledge' ? (
          <Box>
            <Box className="bg-[#232935] rounded-xl flex pb-6 flex-col p-3">
              <Box className="flex flex-row justify-between mb-2">
                <Typography variant="h6" className="text-[#78859E] ml-2 mt-1.5">
                  To pledge:{' '}
                  <span className="text-white">{selectedNfts.length}</span>
                </Typography>
              </Box>
              <Box className="h-[15.8rem] overflow-y-auto overflow-x-hidden">
                {userNfts?.length > 0
                  ? Array.from({ length: userNfts.length }, (_, i) => (
                      <Box
                        className="mt-2 ml-2 mr-2 border border-[#343C4D] flex rounded-md cursor-pointer"
                        key={i}
                        onClick={() => handleSelectNft(i)}
                      >
                        <img
                          src={userNfts[i].img}
                          alt="diamond pepe"
                          className={'w-[4rem] m-2 rounded-md'}
                        />
                        <Box>
                          <Typography
                            variant="h6"
                            className="text-white ml-2 mt-4 font-bold"
                          >
                            Diamond Pepe
                          </Typography>
                          <Typography
                            variant="h6"
                            className="text-white ml-2 mt-0.5 font-bold"
                          >
                            # {userNfts[i].id}
                          </Typography>
                        </Box>
                        {selectedNfts.indexOf(i) !== -1 ? (
                          <Box>
                            <Typography
                              variant="h6"
                              className="text-white ml-4 mt-1 pt-4"
                            >
                              🔥
                            </Typography>
                          </Box>
                        ) : null}
                      </Box>
                    ))
                  : null}
              </Box>
            </Box>

            {userPledgedNfts?.length > 0 ? (
              <Box className="bg-[#232935] rounded-xl flex pb-6 flex-col p-3 mt-4">
                <Box className="flex flex-row justify-between mb-2">
                  <Typography
                    variant="h6"
                    className="text-[#78859E] ml-2 mt-1.5"
                  >
                    Pledged:{' '}
                    <span className="text-white">{userPledgedNfts.length}</span>
                  </Typography>
                </Box>
                <Box className="h-[10.5rem] overflow-y-auto overflow-x-hidden">
                  {Array.from({ length: userPledgedNfts.length }, (_, i) => (
                    <Box
                      className="mt-2 ml-2 mr-2 border border-[#343C4D] flex rounded-md"
                      key={i}
                    >
                      <img
                        src={userPledgedNfts[i].img}
                        alt="diamond pepe"
                        className={'w-[4rem] m-2 rounded-md'}
                      />
                      <Box>
                        <Typography
                          variant="h6"
                          className="text-white ml-2 mt-4 font-bold"
                        >
                          Diamond Pepe
                        </Typography>
                        <Typography
                          variant="h6"
                          className="text-white ml-2 mt-0.5 font-bold"
                        >
                          # {userPledgedNfts[i].id}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          className="text-white ml-4 mt-1 pt-4"
                        >
                          🔥
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : null}

            <Box className="rounded-xl p-4 pb-1 border border-neutral-800 w-full bg-[#232935] mt-4">
              <Box className="rounded-md flex flex-col mb-4 p-4 pt-3.5 pb-3.5 border border-neutral-800 w-full bg-[#343C4D]">
                <EstimatedGasCostButton gas={5000000} chainId={chainId} />
              </Box>

              <Box className="flex mb-2">
                <Box className="flex text-center p-2 mr-2">
                  <img
                    src="/assets/alarm.svg"
                    className="w-7 h-5"
                    alt="Alarm"
                  />
                </Box>
                <Typography variant="h6" className="text-[#78859E]">
                  Check if you have received a 1-of-1 after the pledge period on
                  3/3/2022
                </Typography>
              </Box>
              <CustomButton
                size="medium"
                className={styles.pepeButton}
                disabled={selectedNfts.length == 0}
                onClick={approved ? handlePledge : handleApprove}
              >
                <Typography variant="h5" className={styles.pepeButtonText}>
                  {!approved
                    ? 'Approve'
                    : 'Pledge ' + selectedNfts.length + ' pepes'}
                </Typography>
              </CustomButton>
            </Box>
          </Box>
        ) : null}
        {activeTab === 'winner' ? (
          <Box>
            <Box className="bg-[#232935] rounded-xl flex pb-6 flex-col p-3">
              <Typography variant="h6" className="text-white p-1 pl-2 pr-2">
                The winning numbers are
              </Typography>
              <Box className="flex w-full mt-3 ml-1 mr-1 flex-wrap">
                {winners?.length > 0
                  ? Array.from({ length: winners.length }, (_, i) => (
                      <Typography
                        variant="h6"
                        className="text-white p-1 pl-2 pr-2 border border-[#343C4D] rounded-md w-auto h-[2rem] bg-[#b3a932] ml-1 mr-1 mb-2"
                      >
                        <b>{winners[i]['number']}</b>
                      </Typography>
                    ))
                  : null}
              </Box>
            </Box>
            <Box className="bg-[#232935] rounded-xl flex pb-6 flex-col p-3 mt-3">
              <Typography variant="h6" className="text-white p-1 pl-2 pr-2">
                The winning addresses are
              </Typography>
              <Box className="flex w-full mt-3 ml-1 mr-1 flex-wrap h-[17.7rem] overflow-y-auto overflow-x-hidden">
                {winners?.length > 0
                  ? Array.from({ length: winners.length }, (_, i) => (
                      <Typography
                        variant="h6"
                        className="text-white p-1 pl-2 pr-2 border border-[#343C4D] rounded-md w-auto h-[2rem] ml-1 mr-1 mb-2 text-[11px]"
                      >
                        <b>{winners[i]['address']}</b>
                      </Typography>
                    ))
                  : null}
              </Box>
            </Box>
          </Box>
        ) : null}
      </Box>
    </Dialog>
  );
};

export default PledgeDialog;
