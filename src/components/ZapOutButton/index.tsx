import Box from '@material-ui/core/Box';
import Typography from '../UI/Typography';

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
      <svg
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-1.5 mt-1"
      >
        <path
          d="M7.99989 0.514648C3.86739 0.514648 0.514893 3.86715 0.514893 7.99965C0.514893 12.1321 3.86739 15.4846 7.99989 15.4846C12.1324 15.4846 15.4849 12.1321 15.4849 7.99965C15.4849 3.86715 12.1324 0.514648 7.99989 0.514648Z"
          fill="url(#paint0_linear_1773_40187)"
        />
        <path
          d="M5.46553 11.5537L7.01803 8.86466L5.29031 7.86716C5.04999 7.72841 5.03761 7.37485 5.27827 7.22801L10.3573 3.95096C10.6829 3.73194 11.0803 4.1086 10.8816 4.45285L9.3103 7.17433L10.9601 8.12683C11.2004 8.26558 11.21 8.6089 10.9824 8.76324L6.00008 12.0528C5.66419 12.2746 5.26678 11.8979 5.46553 11.5537Z"
          fill="white"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1773_40187"
            x1="15.4849"
            y1="17.6232"
            x2="0.399917"
            y2="0.616632"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#002EFF" />
            <stop offset="1" stopColor="#22E1FF" />
          </linearGradient>
        </defs>
      </svg>

      <Typography variant="h6" className="text-white text-[0.7rem]">
        Zap Out
      </Typography>

      <svg
        width="14"
        height="14"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ml-2.5 mr-1.5 mt-1"
      >
        <path
          d="M6.00002 0.166748C2.77419 0.166748 0.166687 2.77425 0.166687 6.00008C0.166687 9.22592 2.77419 11.8334 6.00002 11.8334C9.22585 11.8334 11.8334 9.22592 11.8334 6.00008C11.8334 2.77425 9.22585 0.166748 6.00002 0.166748ZM8.50835 8.50842C8.28085 8.73592 7.91335 8.73592 7.68585 8.50842L6.00002 6.82258L4.31419 8.50842C4.08669 8.73592 3.71919 8.73592 3.49169 8.50842C3.26419 8.28092 3.26419 7.91342 3.49169 7.68592L5.17752 6.00008L3.49169 4.31425C3.26419 4.08675 3.26419 3.71925 3.49169 3.49175C3.71919 3.26425 4.08669 3.26425 4.31419 3.49175L6.00002 5.17758L7.68585 3.49175C7.91335 3.26425 8.28085 3.26425 8.50835 3.49175C8.73585 3.71925 8.73585 4.08675 8.50835 4.31425L6.82252 6.00008L8.50835 7.68592C8.73002 7.90758 8.73002 8.28092 8.50835 8.50842Z"
          fill="#8E8E8E"
        />
      </svg>
    </Box>
  );
};

export default ZapOutButton;
