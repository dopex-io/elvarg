import { useEffect, useContext, useState, useMemo, useCallback } from 'react';

import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import EstimatedGasCostButton from 'components/EstimatedGasCostButton';

import BigCrossIcon from 'components/Icons/BigCrossIcon';

import { Data, UserData } from '../../interfaces';

import { WalletContext } from 'contexts/Wallet';

import useSendTx from 'hooks/useSendTx';

import styles from './styles.module.scss';
import cx from 'classnames';

export interface Props {
  open: boolean;
  tab: string;
  data: Data;
  userData: UserData;
  handleClose: () => void;
  updateData: () => {};
  updateUserData: () => {};
}

const Hero = ({ active, heroColor, letter }) => {
  const heroColorToClass = useMemo(() => {
    if (heroColor === 'blue') return styles.blueBackground;
    if (heroColor === 'orange') return styles.orangeBackground;
    if (heroColor === 'diamond') return styles.diamondBackground;
    if (heroColor === 'gold') return styles.goldBackground;
  }, [heroColor]);

  return active ? (
    <Box>
      <img src={`/assets/pepe-frame-${heroColor}.png`} className="w-full" />
      <Box
        className={cx(
          heroColorToClass,
          'absolute w-14 text-center rounded-xl left-[1.2rem] top-[4rem] z-50'
        )}
      >
        <Typography
          variant="h6"
          className={"text-stieglitz font-['Minecraft'] text-black pt-0.5"}
        >
          {letter}
        </Typography>
      </Box>
    </Box>
  ) : (
    <Box>
      <img src={`/assets/pepe-frame.png`} className="w-full" />
      <Box className="bg-[#232935] absolute w-14 text-center rounded-xl left-[1.2rem] top-[4rem] z-50">
        <Typography variant="h6" className="text-stieglitz font-['Minecraft']">
          ?
        </Typography>
      </Box>
    </Box>
  );
};

const quotes = [
  {
    avatar: 'tz-pepe.png',
    text: 'Atlanteenis',
    author: '- Tz',
  },
  {
    avatar: 'ceo-pepe.png',
    text: 'Booba',
    author: '- Esteemed CEO',
  },
  {
    avatar: 'ceo-pepe.png',
    text: 'Welcome and Good Nueenis',
    author: '- Esteemed CEO',
  },
  {
    avatar: 'intern-pepe.png',
    text: 'Weenis',
    author: '- Dopex Intern',
  },
];

const ActionsDialog = ({
  open,
  tab,
  data,
  userData,
  handleClose,
  updateData,
  updateUserData,
}: Props) => {
  const { chainId, signer } = useContext(WalletContext);
  const [toMint, setToMint] = useState<number>(1);

  const decreaseToMintAmount = () => {
    if (toMint > 1) setToMint(toMint - 1);
  };

  const increaseToMintAmount = () => {
    setToMint(toMint + 1);
  };

  const heroColor = useMemo(() => {
    if (toMint === 1) return 'blue';
    else if (toMint === 2) return 'orange';
    else if (toMint === 3) return 'diamond';
    else if (toMint >= 4) return 'gold';
  }, [toMint]);

  const [activeTab, setActiveTab] = useState<string>('mint');

  const [activeQuoteIndex, setActiveQuoteIndex] = useState<number>(
    Math.floor(Math.random() * quotes.length)
  );

  const [lastType, setLastType] = useState<number>(0);

  const quote = useMemo(() => {
    return quotes[activeQuoteIndex];
  }, [activeQuoteIndex]);

  const sendTx = useSendTx();

  const pepeReserved: number = useMemo(() => {
    return data.mintPrice.gt(0)
      ? Math.floor(Number(userData.deposits.div(data.mintPrice).toString()))
      : 0;
  }, [data, userData]);

  const handleMint = useCallback(async () => {}, [
    signer,
    updateData,
    updateUserData,
    sendTx,
  ]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      let newIndex = Math.floor(Math.random() * quotes.length);
      if (newIndex === activeQuoteIndex) {
        if (newIndex === 0) newIndex = 1;
        else newIndex - 1;
      }
      setActiveQuoteIndex(newIndex);
      const el = document.getElementById('typewriter');
      if (el) {
        let copy = el.cloneNode(true);
        copy.innerHTML = quotes[newIndex].text;
        el.parentNode.replaceChild(copy, el);
      }
    }, 3500);

    return () => clearInterval(intervalId);
  }, []);

  const boxes = [
    { title: '0.88 ETH', subTitle: '1 PEPE' },
    { title: '996', subTitle: 'REMAINING' },
    { title: '12h 11m', subTitle: 'TIME' },
  ];

  useEffect(() => {
    if (['mint', 'withdraw'].includes(tab)) setActiveTab(tab);
  }, [tab]);

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
        <img
          src={'/assets/mint-fighter-button.png'}
          className={'w-46 mr-1 ml-auto'}
        />
        <IconButton
          className="p-0 pb-1 mr-0 mt-0.5 ml-auto"
          onClick={handleClose}
          size="large"
        >
          <BigCrossIcon className="" />
        </IconButton>
      </Box>
      <Box className="flex lg:grid lg:grid-cols-12">
        <Box className="col-span-3 pl-2 pr-2 relative">
          <Hero active={toMint >= 1} heroColor={heroColor} letter={'H'} />
        </Box>
        <Box className="col-span-3 pl-2 pr-2 relative">
          <Hero active={toMint >= 2} heroColor={heroColor} letter={'O'} />
        </Box>
        <Box className="col-span-3 pl-2 pr-2 relative">
          <Hero active={toMint >= 3} heroColor={heroColor} letter={'D'} />
        </Box>
        <Box className="col-span-3 pl-2 pr-2 relative">
          <Hero active={toMint >= 4} heroColor={heroColor} letter={'L'} />
        </Box>
      </Box>
      <Box className="p-2 mt-5 md:flex">
        {boxes.map((box, i) => (
          <Box className="md:w-1/3 p-2 text-center" key={i}>
            <Typography
              variant="h5"
              className="text-white font-display font-['Minecraft'] relative z-1"
            >
              <span className={styles.pepeText}>{box.title}</span>
            </Typography>
            <Typography
              variant="h5"
              className="text-[#78859E] font-['Minecraft'] relative z-1"
            >
              {box.subTitle}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box className={'mt-2'}>
        <Box className="bg-[#232935] rounded-xl flex pb-6 flex-col p-3">
          <Box className="flex flex-row justify-between mb-2 mt-1">
            <Typography variant="h6" className="text-[#78859E] ml-2 mt-1.5">
              Mint with{' '}
              <span className={cx("font-['Minecraft']", styles.pepeText)}>
                $APE
              </span>
            </Typography>
            <Switch className="ml-auto cursor-pointer" color="default" />
          </Box>
          <Box className="flex pl-2 pr-2">
            <button
              className={styles.pepeButtonSquare}
              disabled={toMint < 2}
              onClick={decreaseToMintAmount}
            >
              -
            </button>
            <button
              className={cx('ml-2', styles.pepeButtonSquare)}
              onClick={increaseToMintAmount}
            >
              +
            </button>
            <Input
              id="amount"
              name="amount"
              className={
                'ml-4 bg-[#343C4D] text-white text-right w-full pl-3 pr-3'
              }
              type="number"
              value={toMint}
              classes={{ input: 'text-right' }}
            />
          </Box>
        </Box>
        <Box className="rounded-xl p-4 pb-1 border border-neutral-800 w-full bg-[#232935] mt-3">
          <Box className="rounded-md flex flex-col mb-4 p-4 pt-3.5 pb-3.5 border border-neutral-800 w-full bg-[#343C4D]">
            <EstimatedGasCostButton gas={2000000} chainId={chainId} />
            <Box className={'flex mt-3'}>
              <Typography variant="h6" className="text-stieglitz ml-0 mr-auto">
                Total cost
              </Typography>
              <Box className={'text-right'}>
                <Typography variant="h6" className="text-white mr-auto ml-0">
                  {userData.minted ? 0 : pepeReserved}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box className="flex mb-2">
            <img src={`/assets/${quote.avatar}`} className="ml-[2px] w-16" />

            <Box className="bg-[#343C4D] rounded-xs flex flex-col p-3 pb-1.5 w-full ml-4 relative">
              <img
                src="/assets/polygon-left.svg"
                className="absolute left-[-7px] top-[20px] w-3"
              />
              <Typography
                variant="h6"
                className="text-white font-['Minecraft'] typewriter"
                id="typewriter"
              >
                {quote.text}
              </Typography>
              <Typography
                variant="h6"
                className="text-stieglitz font-['Minecraft']"
              >
                {quote.author}
              </Typography>
            </Box>
          </Box>
          <CustomButton
            size="medium"
            className={styles.pepeButton}
            disabled={!data.isFarmingPeriod || userData.minted}
            onClick={handleMint}
          >
            <Typography variant="h5" className={styles.pepeButtonText}>
              {data.isFarmingPeriod
                ? userData.minted
                  ? 'Already minted'
                  : 'Mint'
                : 'Not ready yet'}
            </Typography>
          </CustomButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ActionsDialog;
