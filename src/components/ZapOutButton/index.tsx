import Box from '@material-ui/core/Box';
import Typography from '../UI/Typography';
import ZapIcon from '../Icons/ZapIcon';

export interface Props {
  isZapActive: boolean;
  handleClick: () => void;
  background?: string;
}

const ZapOutButton = ({
  isZapActive,
  handleClick,
  background = 'bg-neutral-700',
}: Props) => {
  return (
    <Box
      onClick={handleClick}
      className={
        isZapActive
          ? `rounded-md flex r-0 ml-auto p-1.5 pt-[0.4rem] pb-[0.4rem] pr-0 border border-neutral-800 cursor-pointer hover:opacity-90 ${background}`
          : 'flex r-0 ml-auto p-1.5 pt-1 border opacity-0'
      }
    >
      <ZapIcon className="mr-[0.3rem] mt-[0.18rem]" id="1" />

      <Typography variant="h6" className="text-white text-[0.7rem]">
        Cancel
      </Typography>

      <img
        src="/assets/cross.svg"
        className="ml-2 mr-1.5 mt-[0.18rem]"
        alt={'Cancel'}
      />
    </Box>
  );
};

export default ZapOutButton;
