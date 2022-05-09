import React, {
  useEffect,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Addresses, DiamondPepeNFTs__factory } from '@dopex-io/sdk';
import { BigNumber } from 'ethers';
import cx from 'classnames';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Tooltip } from '@mui/material';
import Input from '@mui/material/Input';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import EstimatedGasCostButton from 'components/EstimatedGasCostButton';

import { Data, UserData } from 'interfaces/diamondpepes/interfaces';

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
  updateData: () => {};
  updateUserData: () => {};
  pledge: any;
}

const SelectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 324,
      width: 250,
    },
  },
  classes: {
    paper: 'bg-mineshaft',
  },
};

const Pledge2Dialog = ({
  open,
  handleClose,
  data,
  tab,
  userData,
  updateData,
  updateUserData,
  pledge,
}: Props) => {
  const { updateAssetBalances, userAssetBalances, tokens, tokenPrices } =
    useContext(AssetsContext);
  const { accountAddress, chainId, signer, provider } =
    useContext(WalletContext);

  const diamondPepeNfts = useMemo(
    () =>
      DiamondPepeNFTs__factory.connect(
        Addresses[chainId]['NFTS']['DiamondPepesNFT'],
        signer
      ),
    [signer]
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
  const [selectedNfts, setSelectedNfts] = useState({});
  const amount: number = useMemo(() => {
    return parseFloat(rawAmount) || 0;
  }, [rawAmount]);

  const availableUserNfts = useMemo(() => {
    const _userNfts = [];

    userNfts.map((nft) => {
      let add = true;
      Object.keys(selectedNfts).map((key) => {
        selectedNfts[key].map((selected_nft) => {
          if (Number(nft.id) === Number(selected_nft.id)) add = false;
        });
      });
      if (add) {
        _userNfts.push(nft);
      }
    });
    return _userNfts;
  }, [userNfts, selectedNfts]);

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
  }, [pledge, diamondPepeNfts, accountAddress]);

  const [activeTab, setActiveTab] = useState<string>('pledge');

  const modalHeight = useMemo(() => {
    if (userPledgedNfts.length > 0 && userNfts.length > 0) return '47.2rem';
    else return '31.2rem';
  }, [userPledgedNfts, userNfts]);

  const handlePledge = useCallback(async () => {
    try {
      const tokenIds: BigNumber[][] = [];
      Object.keys(selectedNfts).map((parent_nft_id) => {
        const group = [];
        group.push(BigNumber.from(parent_nft_id));
        selectedNfts[parent_nft_id].map((children_nft) => {
          group.push(BigNumber.from(children_nft.id));
        });
        tokenIds.push(group);
      });
      console.log(tokenIds);
      await sendTx(pledge.connect(signer).pledge(tokenIds));
      await updateData();
      await updateUserData();
      await getNfts();
      setSelectedNfts({});
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

  const handleSelectNft = (parent_nft) => {
    const _selectedNfts = Object.assign({}, selectedNfts);
    if (_selectedNfts[parent_nft.id]) delete _selectedNfts[parent_nft.id];
    else _selectedNfts[parent_nft.id] = [];
    setSelectedNfts(_selectedNfts);
  };

  const handleIncreaseRarity = (parent_nft_id, children_nft) => {
    const _selectedNfts = Object.assign({}, selectedNfts);
    _selectedNfts[parent_nft_id].push(children_nft);
    setSelectedNfts(_selectedNfts);
  };

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
        <img
          src="/assets/cross.svg"
          className="ml-auto mr-1.5 fill-white pointer"
          alt={'Close'}
          onClick={handleClose}
        />
      </Box>

      {['pledge'].includes(activeTab) && (
        <Box className={isZapInVisible ? 'hidden' : 'flex'}>
          <Box className={'w-full flex'}>
            <Box
              className={
                'flex flex-row mb-3 justify-between p-1 border-[1px] border-[#232935] rounded-md w-full'
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
          </Box>
        </Box>
      )}

      <Box style={{ height: modalHeight }}>
        {activeTab === 'pledge' ? (
          <Box>
            <Box className="bg-[#232935] rounded-xl flex pb-6 flex-col p-3">
              <Box className="h-[15.8rem] overflow-y-auto overflow-x-hidden">
                {availableUserNfts.map((nft) => (
                  <Box
                    className="mt-2 ml-2 mr-2 border border-[#343C4D] rounded-md"
                    key={nft.id}
                  >
                    <Box className="flex mt-1">
                      <img
                        src={nft.img}
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
                          # {nft.id}
                        </Typography>
                      </Box>
                      {selectedNfts[nft.id] ? (
                        <Box>
                          <Typography
                            variant="h6"
                            className="text-white ml-4 mt-1 pt-4"
                          >
                            🔥
                          </Typography>
                        </Box>
                      ) : null}
                      <Box className={'flex mt-[1.4rem] ml-2'}>
                        {selectedNfts[nft.id]?.map((children_nft) => (
                          <Tooltip
                            title={'Click to remove Pepe #' + children_nft.id}
                            key={children_nft.id}
                          >
                            <img
                              src={children_nft.img}
                              alt="diamond pepe"
                              className={
                                'w-[1rem] h-[1rem] mr-1 rounded-md cursor-pointer'
                              }
                            />
                          </Tooltip>
                        ))}
                      </Box>
                    </Box>
                    <Box className="ml-2 mr-2">
                      <CustomButton
                        size="medium"
                        className={styles.pepeButton}
                        onClick={() => handleSelectNft(nft)}
                      >
                        <Typography
                          variant="h5"
                          className={styles.pepeButtonText}
                        >
                          {selectedNfts[nft.id] ? 'Remove' : 'Pledge'}
                        </Typography>
                      </CustomButton>
                      {Object.keys(selectedNfts).length > 0 &&
                      !selectedNfts[nft.id] ? (
                        <Select
                          className={cx('!mt-0', styles.pepeButton)}
                          fullWidth
                          displayEmpty
                          input={<Input />}
                          variant="outlined"
                          renderValue={() => {
                            return (
                              <Typography
                                variant="h5"
                                className={cx('pt-1', styles.pepeButtonText)}
                              >
                                Pledge to increase rarity of ?
                              </Typography>
                            );
                          }}
                          MenuProps={SelectMenuProps}
                          classes={{
                            icon: 'absolute right-5 top-1.5 text-white',
                            select: 'overflow-hidden',
                          }}
                          label="strikes"
                        >
                          {Object.keys(selectedNfts).map((parent_nft_id) =>
                            selectedNfts[parent_nft_id].length < 3 ? (
                              <MenuItem
                                key={parent_nft_id}
                                className="pb-2 pt-2"
                                onClick={() =>
                                  handleIncreaseRarity(parent_nft_id, nft)
                                }
                              >
                                <Box className={'flex'}>
                                  <Typography
                                    variant="h5"
                                    className="text-white text-left w-full relative ml-2"
                                  >
                                    Pledge for Pepe #{parent_nft_id}
                                  </Typography>
                                </Box>
                              </MenuItem>
                            ) : null
                          )}
                        </Select>
                      ) : null}
                    </Box>
                  </Box>
                ))}
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
                    className="w-7 h-7"
                    alt="Alarm"
                  />
                </Box>
                <Typography variant="h6" className="text-[#78859E]">
                  Gen 2 (Duel Pepes) will be minted after 537 pledges
                </Typography>
              </Box>
              <CustomButton
                size="medium"
                className={styles.pepeButton}
                disabled={Object.keys(selectedNfts).length == 0}
                onClick={approved ? handlePledge : handleApprove}
              >
                <Typography variant="h5" className={styles.pepeButtonText}>
                  {!approved ? 'Approve' : 'Pledge pepes'}
                </Typography>
              </CustomButton>
            </Box>
          </Box>
        ) : null}
      </Box>
    </Dialog>
  );
};

export default Pledge2Dialog;
