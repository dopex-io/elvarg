import Box from '@mui/material/Box';
import Typography from 'components/UI/Typography';

const movesData: { [key: string]: { textColor: string; value: number } } = {
  kick: {
    textColor: 'text-amber-600',
    value: 2,
  },
  block: {
    textColor: 'text-emerald-400',
    value: 3,
  },
  punch: {
    textColor: 'text-emerald-400',
    value: 1,
  },
  special: {
    textColor: 'text-amber-600',
    value: 3,
  },
};

const Moves = ({ moves }: { moves: string[] }) => {
  return (
    <Box className="flex">
      {moves.map((move: string, i: number) => (
        <Box className="flex" key={i}>
          <Box className="mr-3">
            <Box className="bg-[#343C4D] flex h-10 w-10 rounded-md">
              <img
                src={`/images/nfts/pepes/${move}.png`}
                className="my-auto mx-auto"
                alt="Move"
              />
            </Box>

            <Box className="mt-1 text-center">
              <Typography variant="h6" className="mt-1 text-[10px]">
                <span className={movesData[move]!.textColor}>*</span>
              </Typography>
              <Typography variant="h6" className="text-[10px]">
                <span className="text-white font-['Minecraft']">
                  {movesData[move]!.value}
                </span>
              </Typography>
            </Box>
          </Box>
          {i !== 4 ? (
            <img
              src="/images/misc/arrow-right-black.svg"
              className="w-2.5 h-3 mt-3 mr-3"
              alt="Arrow right"
            />
          ) : null}
        </Box>
      ))}
    </Box>
  );
};

export default Moves;
