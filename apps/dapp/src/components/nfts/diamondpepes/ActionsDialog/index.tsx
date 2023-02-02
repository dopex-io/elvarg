import { useEffect, useState, useMemo, useCallback } from 'react';

import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import formatAmount from 'utils/general/formatAmount';

import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';
import PepeButton from 'components/nfts/components/PepeButton';
import PepeText from 'components/nfts/components/PepeText';
import PepeButtonSquare from 'components/nfts/components/PepeButtonSquare';

import useSendTx from 'hooks/useSendTx';

import BigCrossIcon from 'svgs/icons/BigCrossIcon';

import { useBoundStore } from 'store';

import styles from './styles.module.scss';
import cx from 'classnames';

export interface Props {
  open: boolean;
  tab: string;
  handleClose: () => void;
}

const Hero = ({
  active,
  heroColor,
  letter,
}: {
  active: boolean;
  heroColor: string;
  letter: string;
}) => {
  const heroColorToClass = useMemo(() => {
    if (heroColor === 'blue') return styles['blueBackground'];
    if (heroColor === 'orange') return styles['orangeBackground'];
    if (heroColor === 'diamond') return styles['diamondBackground'];
    return styles['goldBackground'];
  }, [heroColor]);

  return active ? (
    <Box>
      <img
        src={`/assets/pepe-frame-${heroColor}.png`}
        className="w-full"
        alt={'Pepe'}
      />
      <Box
        className={cx(
          heroColorToClass,
          'absolute w-14 text-center rounded-xl left-[1.2rem] top-[4rem] z-50'
        )}
      >
        <Typography
          variant="h6"
          className={"font-['Minecraft'] text-black pt-0.5"}
        >
          {letter}
        </Typography>
      </Box>
    </Box>
  ) : (
    <Box>
      <img src={`/assets/pepe-frame.png`} className="w-full" alt={'Pepe'} />
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

const ActionsDialog = ({ open, handleClose }: Props) => {
  const sendTx = useSendTx();
  const { chainId, pepesData, mintContract, signer, accountAddress } =
    useBoundStore();
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
    return 'gold';
  }, [toMint]);

  const [activeQuoteIndex, setActiveQuoteIndex] = useState<number>(
    Math.floor(Math.random() * quotes.length)
  );

  const quote = useMemo(() => {
    return quotes[activeQuoteIndex];
  }, [activeQuoteIndex]);

  const handleMint = useCallback(async () => {
    await sendTx(mintContract.connect(signer), 'mint', [
      toMint,
      accountAddress,
      { value: getContractReadableAmount(0.88, 18).mul(toMint) },
    ]);
  }, [mintContract, signer, toMint, accountAddress, sendTx]);

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
        let copy = el.cloneNode(true) as HTMLElement;
        copy.innerHTML = quotes[newIndex]!.text;
        el.parentNode!.replaceChild(copy, el);
      }
    }, 3500);

    return () => clearInterval(intervalId);
  }, [activeQuoteIndex]);

  const boxes = [
    { title: '0.88 ETH', subTitle: '1 PEPE' },
    {
      title: Math.max(
        BigNumber.from(1111).sub(pepesData?.nextMintId)?.toNumber(),
        0
      ),
      subTitle: 'REMAINING',
    },
  ];

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
      <Box className="flex flex-row items-center mb-4" id={'emojisplosion'}>
        <img
          src={'/assets/mint-fighter-button.png'}
          className={'w-46 mr-1 ml-auto'}
          alt={'Mint fighter'}
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
          <Box className="md:w-1/2 p-2 text-center" key={i}>
            <Typography
              variant="h5"
              className="text-white font-display font-['Minecraft'] relative z-1"
            >
              <PepeText text={String(box.title)} />
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
        <Box className="bg-[#232935] rounded-xl flex pb-3 flex-col p-3">
          <Box className="flex pl-2 pr-2">
            <PepeButtonSquare
              text="-"
              action={decreaseToMintAmount}
              disabled={toMint < 2}
            />

            <Box className="ml-2">
              <PepeButtonSquare
                text="+"
                action={increaseToMintAmount}
                disabled={false}
              />
            </Box>

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
                  {formatAmount(0.88 * toMint, 2)} ETH
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box className="flex mb-2">
            <img
              src={`/assets/${quote!.avatar}`}
              className="ml-[2px] w-16"
              alt={''}
            />
            <Box className="bg-[#343C4D] rounded-xs flex flex-col p-3 pb-1.5 w-full ml-4 relative">
              <img
                src="/assets/polygon-left.svg"
                className="absolute left-[-7px] top-[20px] w-3"
                alt={'Left'}
              />
              <Typography
                variant="h6"
                className="text-white font-['Minecraft'] typewriter"
                id="typewriter"
              >
                {quote!.text}
              </Typography>
              <Typography
                variant="h6"
                className="text-stieglitz font-['Minecraft']"
              >
                {quote!.author}
              </Typography>
            </Box>
          </Box>
          <PepeButton handleMint={handleMint} text={'Buy'} />
        </Box>
      </Box>
    </Dialog>
  );
};

export default ActionsDialog;
