import { useMemo, useContext } from 'react';
import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import displayAddress from 'utils/general/displayAddress';

import { Duel } from 'contexts/Duel';
import { WalletContext } from 'contexts/Wallet';

import styles from '../styles.module.scss';
import Countdown from 'react-countdown';

const ActiveDuel = ({
  duel,
  handleUndo,
  handleReveal,
}: {
  duel: Duel;
  handleUndo: Function;
  handleReveal: Function;
}) => {
  const { accountAddress } = useContext(WalletContext);

  const handleClick = () => {
    if (duel['status'] === 'requireUndo') handleUndo(duel['id']);
    else if (duel['status'] === 'requireReveal') handleReveal(duel);
  };

  const message = useMemo(() => {
    if (duel['status'] === 'waiting') return 'WAIT...';
    else if (duel['status'] === 'requireUndo') return 'UNDO';
    else if (duel['status'] === 'won') return 'YOU WON';
    else if (duel['status'] === 'lost') return 'YOU LOST';
    else if (
      duel['status'] === 'requireReveal' &&
      duel['duelistAddress'] === accountAddress
    )
      return 'REVEAL';
    else if (
      duel['status'] === 'requireReveal' &&
      duel['duelistAddress'] !== accountAddress
    )
      return 'WAIT REVEAL...';
    else return 'TIE';
  }, [duel, accountAddress]);

  return (
    <Box className="w-full flex p-5 bg-[#181C24] relative">
      <img
        src={`https://img.tofunft.com/v2/42161/0xede855ced3e5a59aaa267abdddb0db21ccfe5072/${duel['duelist']}/280/static.jpg`}
        className="rounded-md w-14 h-14 mt-1 mr-3"
      />
      <Box>
        <Typography
          variant="h4"
          className="font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-left text-white"
        >
          <span>#{duel['duelist']}</span>
        </Typography>
        <Typography
          variant="h4"
          className="text-[#78859E] font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-center"
        >
          <span>Diamond Pepe</span>
        </Typography>
      </Box>
      <Box className="ml-8">
        <Typography
          variant="h4"
          className="font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-left text-white"
        >
          <span>#{duel['id']}</span>
        </Typography>
        <Typography
          variant="h4"
          className="text-[#78859E] font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-center"
        >
          <span>Duel ID</span>
        </Typography>
      </Box>
      <Box className="ml-10 mt-2 mr-8">
        <Box className="flex">
          {duel['isRevealed'] ? (
            duel['duelistMoves'].map((move, i) => (
              <img
                key={i}
                src={`/images/nfts/pepes/${move}.png`}
                className={
                  'w-4 h-4 ' +
                  (i < duel['duelistMoves'].length - 1 ? 'mr-1' : '')
                }
              />
            ))
          ) : (
            <Box className="flex">
              <img
                src="/images/nfts/pepes/help-center.png"
                className="w-4 h-4 mr-1"
              />
              <img
                src="/images/nfts/pepes/help-center.png"
                className="w-4 h-4 mr-1"
              />
              <img
                src="/images/nfts/pepes/help-center.png"
                className="w-4 h-4 mr-1"
              />
              <img
                src="/images/nfts/pepes/help-center.png"
                className="w-4 h-4"
              />
            </Box>
          )}
        </Box>
        <Typography
          variant="h4"
          className="text-[#78859E] font-['Minecraft'] relative z-1 mx-auto mt-3 ml-1 text-left"
        >
          <span>Moves</span>
        </Typography>
      </Box>

      <Box className="ml-auto mr-auto mt-2.5">
        <button className={styles['pepeButton']} onClick={handleClick}>
          {message}
        </button>
      </Box>

      <Box className="ml-auto mt-2">
        <Box className="flex">
          <img
            src="/images/nfts/pepes/help-center.png"
            className="w-4 h-4 mr-1"
          />
          <img
            src="/images/nfts/pepes/help-center.png"
            className="w-4 h-4 mr-1"
          />
          <img
            src="/images/nfts/pepes/help-center.png"
            className="w-4 h-4 mr-1"
          />
          <img src="/images/nfts/pepes/help-center.png" className="w-4 h-4" />
        </Box>
        <Typography
          variant="h4"
          className="text-[#78859E] font-['Minecraft'] relative z-1 mx-auto mt-3 ml-1 text-right"
        >
          <span>Moves</span>
        </Typography>
      </Box>
      <Box className="ml-8">
        <Typography
          variant="h4"
          className="font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-left text-white"
        >
          <span>{displayAddress(duel['challengerAddress'])}</span>
        </Typography>
        <Typography
          variant="h4"
          className="text-[#78859E] font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-center"
        >
          <span>Opponent</span>
        </Typography>
      </Box>
      <Box className="ml-5">
        <Typography
          variant="h4"
          className="font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-right text-white"
        >
          <span>
            #{duel['challengerAddress'] === '?' ? '?' : duel['challenger']}
          </span>
        </Typography>
        <Typography
          variant="h4"
          className="text-[#78859E] font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-center"
        >
          <span>Diamond Pepe</span>
        </Typography>
      </Box>
      <img
        src={
          duel['challengerAddress'] === '?'
            ? '/images/nfts/pepes/pepe-frame-1.png'
            : `https://img.tofunft.com/v2/42161/0xede855ced3e5a59aaa267abdddb0db21ccfe5072/${duel['challenger']}/280/static.jpg`
        }
        className="rounded-md w-14 h-14 ml-6 mt-1"
      />

      {['won', 'lost', 'tie'].includes(duel['status']) &&
      !duel['isCreatorWinner'] ? (
        <Box className="absolute px-3 py-1 flex rounded-md right-[12rem] top-[5.5rem] bg-[#FFD50B]">
          <img src="/images/misc/crown.svg" className="w-4 h-4 mr-1 mt-0.5" />
          <Typography variant="h6">
            <span className="font-['Minecraft'] text-black">WINNER</span>
          </Typography>
        </Box>
      ) : null}

      {['won', 'lost', 'tie'].includes(duel['status']) &&
      duel['isCreatorWinner'] ? (
        <Box className="absolute px-3 py-1 flex rounded-md right-[12rem] top-[5.5rem] bg-[#FF2727]">
          <img src="/images/misc/fire.svg" className="w-4 h-4 mr-1 mt-0.5" />
          <Typography variant="h6">
            <span className="font-['Minecraft'] text-[#FFD50B]">REKT</span>
          </Typography>
        </Box>
      ) : null}

      {!duel['isRevealed'] ? (
        <Box className="absolute bg-[#343C4D] px-3 py-1 flex rounded-md right-[12rem] top-[5.5rem]">
          <img
            src="/assets/timer.svg"
            className="h-[1rem] mt-0.5 mr-2 ml-1"
            alt="Timer"
          />
          <Typography variant="h6">
            <span className="text-wave-blue font-['Minecraft']">
              {duel['challengerAddress'] !== '?' ? (
                <Countdown
                  date={duel['finishDate']}
                  renderer={({ hours, minutes }) => {
                    return (
                      <Box className={'flex'}>
                        <Typography
                          variant="h5"
                          className="ml-auto text-stieglitz mr-1"
                        >
                          {hours}h {minutes}m
                        </Typography>
                      </Box>
                    );
                  }}
                />
              ) : (
                'Not started'
              )}
            </span>
          </Typography>
        </Box>
      ) : null}

      <Box className="absolute bg-[#343C4D] px-3 py-1 flex rounded-md right-[3rem] top-[5.5rem]">
        <Typography variant="h6">
          <span className="font-['Minecraft']">CHALLENGER</span>
        </Typography>
      </Box>

      <Box className="absolute bg-[#343C4D] px-3 py-1 flex rounded-md right-[3rem] top-[5.5rem]">
        <Typography variant="h6">
          <span className="font-['Minecraft']">CHALLENGER</span>
        </Typography>
      </Box>

      <Box className="absolute bg-[#343C4D] px-3 py-1 flex rounded-md right-[47%] top-[-1rem]">
        <img src="/images/misc/diamond.svg" className="w-4 h-4 mr-1 mt-1" />
        <Typography variant="h6">
          <span className="font-['Minecraft'] text-stieglitz">
            <span className="text-white">{duel['wager']} </span>
            {duel['tokenName']}
          </span>
        </Typography>
      </Box>

      <Box className="absolute bg-[#343C4D] px-3 py-1 flex rounded-md left-[3rem] top-[5.5rem]">
        <Typography variant="h6">
          <span className="font-['Minecraft']">DUELIST</span>
        </Typography>
      </Box>

      {['won', 'lost', 'tie'].includes(duel['status']) &&
      duel['isCreatorWinner'] ? (
        <Box className="absolute px-3 py-1 flex rounded-md left-[9.5rem] top-[5.5rem] bg-[#FFD50B]">
          <img src="/images/misc/crown.svg" className="w-4 h-4 mr-1 mt-0.5" />
          <Typography variant="h6">
            <span className="font-['Minecraft'] text-black">WINNER</span>
          </Typography>
        </Box>
      ) : null}

      {['won', 'lost', 'tie'].includes(duel['status']) &&
      !duel['isCreatorWinner'] ? (
        <Box className="absolute px-3 py-1 flex rounded-md left-[9.5rem] top-[5.5rem] bg-[#FF2727]">
          <img src="/images/misc/fire.svg" className="w-4 h-4 mr-1 mt-0.5" />
          <Typography variant="h6">
            <span className="font-['Minecraft'] text-[#FFD50B]">REKT</span>
          </Typography>
        </Box>
      ) : null}

      {!duel['isRevealed'] ? (
        <Box className="absolute px-3 py-1 flex rounded-md left-[9.5rem] top-[5.5rem] bg-[#343C4D]">
          <img
            src="/assets/timer.svg"
            className="h-[1rem] mt-0.5 mr-2 ml-1"
            alt="Timer"
          />
          <Typography variant="h6">
            <span className="text-wave-blue font-['Minecraft']">
              {duel['challengerAddress'] !== '?' ? (
                <Countdown
                  date={duel['finishDate']}
                  renderer={({ hours, minutes }) => {
                    return (
                      <Box className={'flex'}>
                        <Typography
                          variant="h5"
                          className="ml-auto text-stieglitz mr-1"
                        >
                          {hours}h {minutes}m
                        </Typography>
                      </Box>
                    );
                  }}
                />
              ) : (
                'Not started'
              )}
            </span>
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};

export default ActiveDuel;
