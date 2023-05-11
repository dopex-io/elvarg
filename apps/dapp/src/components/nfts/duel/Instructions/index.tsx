import { useState } from 'react';

import Box from '@mui/material/Box';

import Typography from 'components/UI/Typography';

const Instructions = () => {
  const [activeInfoSlide, setActiveInfoSlide] = useState<number>(0);

  return (
    <Box>
      {activeInfoSlide === 0 ? (
        <Box className="bg-[#232935] rounded-md flex flex-col mb-4 px-3 py-3 text-center text-white font-['Minecraft']">
          <Typography variant="h6" className="mt-1">
            <span className="text-[#78859E]">How-To-Play</span>
          </Typography>
          <Typography variant="h6" className="mt-1.5 px-2">
            There are four possible moves with three types of attributes:{' '}
            <span className="text-amber-600">Damage</span>,{' '}
            <span className="text-emerald-400">Guaranteed Damage</span> and{' '}
            <span className="text-cyan-500">Defence</span>
          </Typography>
        </Box>
      ) : null}
      {activeInfoSlide === 1 ? (
        <Box className="bg-[#232935] rounded-md flex flex-col mb-4 px-3 py-3 text-center text-white font-['Minecraft']">
          <Typography variant="h6" className="mt-1">
            <span className="text-[#78859E]">Moves & Attributes</span>
          </Typography>
          <Box className="flex mt-3">
            <Typography variant="h6" className="mt-1.5 px-2 ml-auto mr-auto">
              Punch: <span className="text-amber-600">0</span>{' '}
              <span className="text-emerald-400">1</span>{' '}
              <span className="text-stieglitz">0</span>
            </Typography>

            <Typography variant="h6" className="mt-1.5 px-2 ml-auto mr-auto">
              Kick: <span className="text-amber-600">2</span>{' '}
              <span className="text-stieglitz">0</span>{' '}
              <span className="text-stieglitz">0</span>
            </Typography>
          </Box>

          <Box className="flex mt-2 mb-1.5">
            <Typography variant="h6" className="mt-1.5 px-2 ml-auto mr-auto">
              Block: <span className="text-stieglitz">0</span>{' '}
              <span className="text-stieglitz">0</span>{' '}
              <span className="text-cyan-500">3</span>
            </Typography>

            <Typography variant="h6" className="mt-1.5 px-2 ml-auto mr-auto">
              Special: <span className="text-amber-600">3</span>{' '}
              <span className="text-stieglitz">0</span>{' '}
              <span className="text-stieglitz">0</span>
            </Typography>
          </Box>
        </Box>
      ) : null}
      {activeInfoSlide === 2 ? (
        <Box className="bg-[#232935] rounded-md flex flex-col mb-4 px-3 py-3 text-center text-white font-['Minecraft']">
          <Typography variant="h6" className="mt-1">
            <span className="text-[#78859E]">How-To-Play</span>
          </Typography>
          <Typography variant="h6" className="mt-1.5 px-2">
            There are four possible moves with three types of attributes:{' '}
            <span className="text-amber-600">Damage</span>,{' '}
            <span className="text-emerald-400">Guaranteed Damage</span> and{' '}
            <span className="text-cyan-500">Defence</span>
          </Typography>
        </Box>
      ) : null}

      <Box className="flex mb-8">
        <Box
          className={`w-2 h-2 ${
            activeInfoSlide === 0 ? 'bg-white' : ''
          } border-[#43609A] border-[0.1px] rounded-full ml-auto mr-0 cursor-pointer`}
          onClick={() => setActiveInfoSlide(0)}
        />
        <Box
          className={`w-2 h-2 ${
            activeInfoSlide === 1 ? 'bg-white' : ''
          } border-[#43609A] border-[0.1px] rounded-full ml-2 mr-2 cursor-pointer`}
          onClick={() => setActiveInfoSlide(1)}
        />
        <Box
          className={`w-2 h-2 ${
            activeInfoSlide === 2 ? 'bg-white' : ''
          } border-[#43609A] border-[0.1px] rounded-full ml-0 mr-auto cursor-pointer`}
          onClick={() => setActiveInfoSlide(2)}
        />
      </Box>
    </Box>
  );
};

export default Instructions;
