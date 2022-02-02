import Box from '@material-ui/core/Box';
import Typography from '../UI/Typography';
import ZapIcon from '../Icons/ZapIcon';

export interface Props {
  isZapActive: boolean;
  handleClick: () => void;
}

const ZapOutButton = ({ isZapActive, handleClick }: Props) => {
  return (
    <Box
      onClick={handleClick}
      className={
        isZapActive
          ? 'rounded-md flex r-0 ml-auto p-1.5 pt-[0.4rem] pb-[0.4rem] pr-0 border border-neutral-800 bg-neutral-700 cursor-pointer hover:bg-neutral-600'
          : 'flex r-0 ml-auto p-1.5 pt-1 border opacity-0'
      }
    >
      <ZapIcon className="mr-[0.3rem] mt-[0.18rem]" />

      <Typography variant="h6" className="text-white text-[0.7rem]">
        Zap Out
      </Typography>

      <img src="/assets/cross.svg" className="ml-2 mr-1.5 mt-[0.18rem]" />
    </Box>
  );
};

export default ZapOutButton;
