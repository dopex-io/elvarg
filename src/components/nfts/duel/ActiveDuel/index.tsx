import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';
import displayAddress from 'utils/general/displayAddress';

import styles from '../styles.module.scss';

interface ActiveDuelProps {
  duelist: number;
  opponent: number;
  opponentAddress: string;
  duelId: number;
  moves: string[];
  wager: number;
  isCreatorWinner: boolean;
  isRevealed: boolean;
}

const ActiveDuel = ({
  duelist,
  opponent,
  opponentAddress,
  duelId,
  moves,
  wager,
  isCreatorWinner,
  isRevealed,
}: ActiveDuelProps) => {
  return (
    <Box className="w-full flex p-5 bg-[#181C24] relative">
      <img
        src={`https://img.tofunft.com/image/https%3A%2F%2Fimg.tofunft.com%2Fipfs%2FQmaUb8EfVMoe13QWdH3tBqR8mMiv73Lq9ZGyxZU5xHocVk%2F${duelist}.png/280.jpg`}
        className="rounded-md w-14 h-14 mt-1 mr-3"
      />
      <Box>
        <Typography
          variant="h4"
          className="font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-left text-white"
        >
          <span>#{duelist}</span>
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
          <span>#{duelId}</span>
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
          {moves.map((move, i) => (
            <img
              key={i}
              src={`/images/nfts/pepes/${move}.png`}
              className={'w-4 h-4 ' + (i < moves.length - 1 ? 'mr-1' : '')}
            />
          ))}
        </Box>
        <Typography
          variant="h4"
          className="text-[#78859E] font-['Minecraft'] relative z-1 mx-auto mt-3 ml-1 text-left"
        >
          <span>Moves</span>
        </Typography>
      </Box>

      <Box className="ml-auto mr-auto mt-2.5">
        <button className={styles['pepeButton']}>
          {isRevealed
            ? isCreatorWinner
              ? 'YOU WON'
              : 'YOU LOST'
            : 'REVEAL MOVE'}
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
          <span>{displayAddress(opponentAddress)}</span>
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
          <span>#{opponent}</span>
        </Typography>
        <Typography
          variant="h4"
          className="text-[#78859E] font-['Minecraft'] relative z-1 mx-auto mt-1 ml-3 text-center"
        >
          <span>Diamond Pepe</span>
        </Typography>
      </Box>
      <img
        src={`https://img.tofunft.com/image/https%3A%2F%2Fimg.tofunft.com%2Fipfs%2FQmaUb8EfVMoe13QWdH3tBqR8mMiv73Lq9ZGyxZU5xHocVk%2F${opponent}.png/280.jpg`}
        className="rounded-md w-14 h-14 ml-6 mt-1"
      />

      {isRevealed && !isCreatorWinner ? (
        <Box className="absolute px-3 py-1 flex rounded-md right-[12rem] top-[5.5rem] bg-[#FFD50B]">
          <img src="/images/misc/crown.svg" className="w-4 h-4 mr-1 mt-0.5" />
          <Typography variant="h6">
            <span className="font-['Minecraft'] text-black">WINNER</span>
          </Typography>
        </Box>
      ) : null}

      {isRevealed && isCreatorWinner ? (
        <Box className="absolute px-3 py-1 flex rounded-md right-[12rem] top-[5.5rem] bg-[#FF2727]">
          <img src="/images/misc/fire.svg" className="w-4 h-4 mr-1 mt-0.5" />
          <Typography variant="h6">
            <span className="font-['Minecraft'] text-[#FFD50B]">REKT</span>
          </Typography>
        </Box>
      ) : null}

      {!isRevealed ? (
        <Box className="absolute bg-[#343C4D] px-3 py-1 flex rounded-md right-[12rem] top-[5.5rem]">
          <img
            src="/assets/timer.svg"
            className="h-[1rem] mt-0.5 mr-2 ml-1"
            alt="Timer"
          />
          <Typography variant="h6">
            <span className="text-wave-blue font-['Minecraft']">
              11H 11M 11S
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
            <span className="text-white">{wager} </span>
            USDC
          </span>
        </Typography>
      </Box>

      <Box className="absolute bg-[#343C4D] px-3 py-1 flex rounded-md left-[3rem] top-[5.5rem]">
        <Typography variant="h6">
          <span className="font-['Minecraft']">DUELIST</span>
        </Typography>
      </Box>

      {isRevealed && isCreatorWinner ? (
        <Box className="absolute px-3 py-1 flex rounded-md left-[9.5rem] top-[5.5rem] bg-[#FFD50B]">
          <img src="/images/misc/crown.svg" className="w-4 h-4 mr-1 mt-0.5" />
          <Typography variant="h6">
            <span className="font-['Minecraft'] text-black">WINNER</span>
          </Typography>
        </Box>
      ) : null}

      {isRevealed && !isCreatorWinner ? (
        <Box className="absolute px-3 py-1 flex rounded-md left-[9.5rem] top-[5.5rem] bg-[#FF2727]">
          <img src="/images/misc/fire.svg" className="w-4 h-4 mr-1 mt-0.5" />
          <Typography variant="h6">
            <span className="font-['Minecraft'] text-[#FFD50B]">REKT</span>
          </Typography>
        </Box>
      ) : null}

      {!isRevealed ? (
        <Box className="absolute px-3 py-1 flex rounded-md left-[9.5rem] top-[5.5rem] bg-[#343C4D]">
          <img
            src="/assets/timer.svg"
            className="h-[1rem] mt-0.5 mr-2 ml-1"
            alt="Timer"
          />
          <Typography variant="h6">
            <span className="text-wave-blue font-['Minecraft']">
              11H 11M 11S
            </span>
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};

export default ActiveDuel;
