import Box from '@mui/material/Box';

const InputHelpers = ({ handleMax }: { handleMax: () => void }) => {
  return (
    <Box
      className="absolute left-2 mt-1.5 right-auto hidden hover:opacity-90 group-hover:block cursor-pointer z-50"
      onClick={handleMax!}
    >
      <img src="/assets/max.svg" alt="MAX" />
    </Box>
  );
};

export default InputHelpers;
