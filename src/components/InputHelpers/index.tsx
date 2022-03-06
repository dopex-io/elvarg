import Box from '@mui/material/Box';

const InputHelpers = ({ handleMax, handleHalf, handleThird }) => {
  return (
    <>
      <Box
        className="absolute left-[10.2rem] mt-[-1.45rem] hidden hover:opacity-90 group-hover:block"
        onClick={handleMax}
      >
        <img src="/assets/max.svg" alt="MAX" className="cursor-pointer" />
      </Box>
      <Box
        className="absolute left-[12.4rem] mt-[-1.45rem] hidden hover:opacity-90 group-hover:block"
        onClick={handleHalf}
      >
        <img src="/assets/half.svg" alt="half" className="cursor-pointer" />
      </Box>
      <Box
        className="absolute left-[13.8rem] mt-[-1.45rem] hidden hover:opacity-90 group-hover:block"
        onClick={handleThird}
      >
        <img src="/assets/third.svg" alt="third" className="cursor-pointer" />
      </Box>
    </>
  );
};

export default InputHelpers;
