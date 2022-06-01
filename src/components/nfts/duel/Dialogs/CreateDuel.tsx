import React, {
  useEffect,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import cx from 'classnames';
import { BigNumber } from 'ethers';
import { emojisplosions } from 'emojisplosion';

import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';

import BigCrossIcon from 'svgs/icons/BigCrossIcon';

import { WalletContext } from 'contexts/Wallet';
import { AssetsContext } from 'contexts/Assets';

import formatAmount from 'utils/general/formatAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import styles from './styles.module.scss';
import getTokenDecimals from '../../../../utils/general/getTokenDecimals';
import ZapInButton from '../../../common/ZapInButton';
import LockerIcon from '../../../../svgs/icons/LockerIcon';
import format from 'date-fns/format';
import Countdown from 'react-countdown';
import WhiteLockerIcon from '../../../../svgs/icons/WhiteLockerIcon';
import CircularProgress from '@mui/material/CircularProgress';

export interface Props {
  open: boolean;
  handleClose: () => void;
}

const CreateDuel = ({ open, handleClose }: Props) => {
  const { chainId, signer } = useContext(WalletContext);
  const [tokenName, setTokenName] = useState<string>('ETH');
  const [wager, setWager] = useState<number>(1);
  const { userAssetBalances } = useContext(AssetsContext);
  const [isSelectingNfts, setIsSelectingNfts] = useState<boolean>(false);
  const [isLoadingNfts, setIsLoadingNfts] = useState<boolean>(true);

  const readableBalance = useMemo(() => {
    return getUserReadableAmount(
      userAssetBalances[tokenName] || BigNumber.from('0'),
      getTokenDecimals(tokenName, chainId)
    );
  }, [tokenName, chainId]);

  // @ts-ignore
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
      {isSelectingNfts ? (
        <Box>
          <Box className="flex flex-row items-center mb-4">
            <IconButton
              className="p-0 pb-1 mr-auto mt-0.5 ml-0"
              onClick={() => setIsSelectingNfts(false)}
              size="large"
            >
              <img
                src="/images/misc/arrow-left-white.svg"
                className="w-46 ml-auto"
                alt="Go back"
              />
            </IconButton>
            <img
              src="/images/nfts/pepes/your-nfts.png"
              className="w-46 mr-auto"
              alt="Your nfts"
            />
          </Box>
          <Box className="h-[40rem] overflow-hidden mt-2">
            <Box className={styles['darkBg']}>
              <Box className="absolute left-[20%] top-[40%] z-50 text-center">
                <Typography
                  variant="h5"
                  className="text-[#9CECFD] font-['Minecraft']"
                >
                  Checking for whitelisted NFTs...
                </Typography>
                <CircularProgress
                  color="inherit"
                  size="17px"
                  className="mr-auto ml-auto mt-0.5 text-[#9CECFD]"
                />
              </Box>

              {[...Array(8)].map(() => {
                return (
                  <Box className="flex lg:grid lg:grid-cols-12 mb-3">
                    <Box className="col-span-3 pl-2 pr-2 relative">
                      <img
                        src="/images/nfts/pepes/pepe-frame-3.png"
                        className="w-full"
                        alt="Pepe"
                      />
                    </Box>
                    <Box className="col-span-3 pl-2 pr-2 relative">
                      <img
                        src="/images/nfts/pepes/pepe-frame-1.png"
                        className="w-full"
                        alt="Pepe"
                      />
                    </Box>
                    <Box className="col-span-3 pl-2 pr-2 relative">
                      <img
                        src="/images/nfts/pepes/pepe-frame-2.png"
                        className="w-full"
                        alt="Pepe"
                      />
                    </Box>
                    <Box className="col-span-3 pl-2 pr-2 relative">
                      <img
                        src="/images/nfts/pepes/pepe-frame-1.png"
                        className="w-full"
                        alt="Pepe"
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box className="flex flex-row items-center mb-4">
            <img
              src={'/images/nfts/pepes/create-duel-button.png'}
              className={'w-46 mr-1 ml-auto'}
              alt={'Create duel'}
            />
            <IconButton
              className="p-0 pb-1 mr-0 mt-0.5 ml-auto"
              onClick={handleClose}
              size="large"
            >
              <BigCrossIcon className="" />
            </IconButton>
          </Box>
          <Box className="bg-[#232935] rounded-2xl flex flex-col mb-4 p-3 pr-2">
            <Box className="flex flex-row justify-between">
              <Box className="h-10 bg-[#181C24] rounded-full pl-1 pr-1 pt-0 pb-0 flex flex-row items-center">
                <Box className="flex flex-row h-10 pr-14">
                  <img
                    src={`/images/tokens/${tokenName.toLowerCase()}.svg`}
                    alt={tokenName}
                    className="w-8 h-8 mt-1"
                  />
                  <Typography
                    variant="h5"
                    className="text-stieglitz text-sm pl-1 pt-1 ml-1 mt-1"
                  >
                    {tokenName}
                  </Typography>
                  <img
                    src="/images/misc/arrow-down.svg"
                    className="w-3 h-1 ml-3 mt-4"
                  />
                </Box>
              </Box>
              <Input
                disableUnderline
                placeholder="0"
                type="number"
                className="h-12 text-2xl text-white ml-2 mr-3 font-mono"
                value={wager}
                onChange={(e) => setWager(Number(e.target.value))}
                classes={{ input: 'text-right' }}
              />
            </Box>
            <Box className="flex flex-row justify-between">
              <Box className="flex">
                <img
                  src="/images/nfts/pepes/crown.svg"
                  className="w-3 h-3 mt-auto mb-1 mr-0.5"
                />
                <Typography
                  variant="h6"
                  className="text-[#78859E] text-sm pl-1 pt-2"
                >
                  Wager
                </Typography>
              </Box>
              <Box className="ml-auto mr-0">
                <Typography variant="h6" className="text-sm pl-1 pt-2 pr-3">
                  <span className="text-[#78859E]">Balance: </span>
                  {formatAmount(readableBalance, 2)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box className="bg-[#232935] rounded-2xl flex flex-col mb-4 p-3 pr-2">
            <Box className="flex">
              <img
                src="/images/misc/person.svg"
                className="w-3.5 h-3.5 mr-1.5 mt-1"
              />
              <Typography variant="h6" className="text-[#78859E] text-sm">
                Select Challenger
              </Typography>
            </Box>
            <Box className="flex relative">
              <img
                src="/images/misc/plus.png"
                className="w-10 h-10 mt-3 cursor-pointer"
                onClick={() => setIsSelectingNfts(true)}
              />
              <Box className="ml-3 mt-2">
                <Typography variant="h5">-</Typography>
                <Typography variant="h6">
                  <span className="text-stieglitz">-</span>
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box className="bg-[#232935] rounded-2xl flex flex-col mb-4 px-3 py-3">
            <Box className="flex">
              <img
                src="/images/misc/gamepad.svg"
                className="w-3.5 h-3.5 mr-1.5 mt-1"
              />
              <Typography variant="h6" className="text-[#78859E] text-sm">
                Select Moves
              </Typography>
            </Box>
            <Box className="flex mt-3 mb-1">
              <Box className="py-6 bg-[#343C4D] flex rounded-md w-full">
                <img
                  src="/images/misc/plus-skin.svg"
                  className="ml-auto mr-auto"
                />
              </Box>
            </Box>
          </Box>

          <Box className="rounded-xl p-4 pb-1.5 border border-[#232935] bg-[#232935] w-full mt-0.5">
            <Box className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-[#343C4D] w-full bg-[#343C4D]">
              <EstimatedGasCostButton gas={500000} chainId={chainId} />
              <Box className={'flex mt-3'}>
                <Typography
                  variant="h6"
                  className="text-[#78859E] ml-0 mr-auto"
                >
                  Max Payout
                </Typography>
                <Box className={'text-right'}>
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    -
                  </Typography>
                </Box>
              </Box>
              <Box className={'flex mt-3'}>
                <Typography
                  variant="h6"
                  className="text-[#78859E] ml-0 mr-auto"
                >
                  Fees
                </Typography>
                <Box className={'text-right'}>
                  <Typography variant="h6" className="text-white mr-auto ml-0">
                    -
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box className="flex mb-1.5">
              <Box className="flex text-center p-2 mr-2 mt-1">
                <img src="/images/misc/clock.svg" className="w-7 h-5 mt-1" />
              </Box>
              <Typography variant="h6" className="mt-1">
                <span className="text-[#78859E]">
                  This duel will remain available for the next 12 hours to
                  challenge.
                </span>
              </Typography>
            </Box>
            <CustomButton
              size="medium"
              className={styles['pepeButton']}
              color={true ? 'primary' : 'mineshaft'}
              disabled={true}
              onClick={() => null}
            >
              {/* @ts-ignore TODO: FIX */}
              <Typography variant="h5" className={styles['pepeButtonText']}>
                CREATE
              </Typography>
            </CustomButton>
          </Box>
        </Box>
      )}
    </Dialog>
  );
};

export default CreateDuel;
