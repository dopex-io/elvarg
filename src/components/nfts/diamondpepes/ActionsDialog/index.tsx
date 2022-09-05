import { useEffect, useContext, useState, useMemo, useCallback } from 'react';
import { YieldMint } from '@dopex-io/sdk';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/Button';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';

import BigCrossIcon from 'svgs/icons/BigCrossIcon';

import { Data, UserData } from 'types/diamondpepes';

import { WalletContext } from 'contexts/Wallet';

import useSendTx from 'hooks/useSendTx';

import styles from './styles.module.scss';

export interface Props {
  open: boolean;
  tab: string;
  data: Data;
  userData: UserData;
  yieldMint: YieldMint;
  handleClose: () => void;
  updateData: () => {};
  updateUserData: () => {};
}

const ActionsDialog = ({
  open,
  tab,
  data,
  userData,
  yieldMint,
  handleClose,
  updateData,
  updateUserData,
}: Props) => {
  const { chainId, signer } = useContext(WalletContext);

  const [activeTab, setActiveTab] = useState<string>('mint');

  const sendTx = useSendTx();

  const pepeReserved: number = useMemo(() => {
    return data.mintPrice.gt(0)
      ? Math.floor(Number(userData.deposits.div(data.mintPrice).toString()))
      : 0;
  }, [data, userData]);

  useEffect(() => {
    if (['mint', 'withdraw'].includes(tab)) setActiveTab(tab);
  }, [tab]);

  const handleMint = useCallback(async () => {
    if (!signer) return;

    try {
      await sendTx(yieldMint.connect(signer).claimMint());
      updateData();
      updateUserData();
    } catch (err) {
      console.log(err);
    }
  }, [signer, updateData, updateUserData, yieldMint, sendTx]);

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
        <IconButton
          className="p-0 pb-1 mr-0 mt-0.5 ml-auto"
          onClick={handleClose}
          size="large"
        >
          <BigCrossIcon className="" />
        </IconButton>
      </Box>
      {['withdraw', 'mint'].includes(activeTab) && (
        <Box className="flex flex-row mb-3 w-full justify-between p-1 border-[1px] border-[#232935] rounded-md">
          <Box
            className={
              activeTab === 'mint'
                ? 'text-center w-1/2 pt-0.5 pb-1 bg-[#343C4D] cursor-pointer group rounded hover:opacity-80'
                : 'text-center w-1/2 pt-0.5 pb-1 cursor-pointer group rounded hover:opacity-80'
            }
            onClick={() => setActiveTab('mint')}
          >
            <Typography
              variant="h6"
              className={
                activeTab === 'mint'
                  ? 'text-xs font-normal'
                  : 'text-[#78859E] text-xs font-normal'
              }
            >
              Mint
            </Typography>
          </Box>
          <Box
            className={
              activeTab === 'withdraw'
                ? 'text-center w-1/2 pt-0.5 pb-1 bg-[#343C4D] cursor-pointer group rounded hover:opacity-80'
                : 'text-center w-1/2 pt-0.5 pb-1 cursor-not-allowed group rounded hover:opacity-80'
            }
          >
            <Typography
              variant="h6"
              className={
                activeTab === 'withdraw'
                  ? 'text-xs font-normal'
                  : 'text-[#78859E] text-xs font-normal'
              }
            >
              Withdraw
            </Typography>
          </Box>
        </Box>
      )}
      <Box style={{ height: 39 + 'rem' }}>
        {activeTab === 'mint' ? (
          <Box>
            <Box className="bg-[#232935] rounded-xl flex pb-6 flex-col p-3">
              <Box className="flex flex-row justify-between mb-2">
                <Typography variant="h6" className="text-[#78859E] ml-2 mt-1.5">
                  {userData.minted ? 'Minted:' : 'Reserved:'}{' '}
                  <span className="text-white">{pepeReserved}</span>
                </Typography>
              </Box>
              <Box className="h-[17rem] overflow-y-auto overflow-x-hidden">
                {Array.from({ length: pepeReserved }, (_, i) => (
                  <Box
                    className="mt-2 ml-2 mr-2 border border-[#343C4D] flex rounded-md"
                    key={i}
                  >
                    <img
                      src={'/assets/diamondpepe.png'}
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
                        className="text-white ml-2 mt-1 font-bold"
                      >
                        # ?
                      </Typography>
                    </Box>
                  </Box>
                ))}
                {pepeReserved === 0 ? (
                  <Box className={'flex text-center h-[16rem]'}>
                    <Typography
                      variant="h6"
                      className="text-[#78859E] ml-auto mr-auto mt-auto mb-auto"
                    >
                      Your pepes will appear here
                      <br />
                      ...
                    </Typography>
                  </Box>
                ) : null}
              </Box>
            </Box>
            <Box className="rounded-xl p-4 pb-1 border border-neutral-800 w-full bg-[#232935] mt-12">
              <Box className="rounded-md flex flex-col mb-4 p-4 pt-3.5 pb-3.5 border border-neutral-800 w-full bg-[#343C4D]">
                <Box className={'flex mb-3'}>
                  <Typography
                    variant="h6"
                    className="text-stieglitz ml-0 mr-auto"
                  >
                    To receive
                  </Typography>
                  <Box className={'text-right'}>
                    <Typography
                      variant="h6"
                      className="text-white mr-auto ml-0"
                    >
                      {userData.minted ? 0 : pepeReserved}
                    </Typography>
                  </Box>
                </Box>
                <EstimatedGasCostButton gas={2000000} chainId={chainId} />
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
                  Check the full reveal on Tofunft after the deposit period on
                  24/2/2022
                </Typography>
              </Box>
              <CustomButton
                size="medium"
                className={styles['pepeButton'] ?? ''}
                disabled={!data.isFarmingPeriod || userData.minted}
                onClick={handleMint}
              >
                <Typography
                  variant="h5"
                  className={styles['pepeButtonText'] ?? ''}
                >
                  {data.isFarmingPeriod
                    ? userData.minted
                      ? 'Already minted'
                      : 'Mint'
                    : 'Not ready yet'}
                </Typography>
              </CustomButton>
            </Box>
          </Box>
        ) : null}
      </Box>
    </Dialog>
  );
};

export default ActionsDialog;
