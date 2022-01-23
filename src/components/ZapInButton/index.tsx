import Box from '@material-ui/core/Box';
import Typography from '../UI/Typography';
import formatAmount from '../../utils/general/formatAmount';
import getUserReadableAmount from '../../utils/contracts/getUserReadableAmount';

export interface Props {
  openZapIn: () => void;
  isZapActive: boolean;
  quote: object;
  tokenName: string;
  ssovTokenSymbol: number;
  selectedTokenPrice: number;
}

const ZapInButton = ({
  openZapIn,
  isZapActive,
  quote,
  tokenName,
  ssovTokenSymbol,
  selectedTokenPrice,
}: Props) => {
  return (
    <Box
      className="rounded-md flex mb-4 p-3 border border-neutral-800 w-full bg-neutral-700 cursor-pointer hover:bg-neutral-600"
      onClick={openZapIn}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mt-1 mr-2.5"
      >
        <path
          d="M7.99989 0.515015C3.86739 0.515015 0.514893 3.86751 0.514893 8.00001C0.514893 12.1325 3.86739 15.485 7.99989 15.485C12.1324 15.485 15.4849 12.1325 15.4849 8.00001C15.4849 3.86751 12.1324 0.515015 7.99989 0.515015Z"
          fill="url(#paint0_linear_1600_23889)"
        />
        <path
          d="M5.46553 11.5539L7.01803 8.8649L5.29031 7.8674C5.04999 7.72865 5.03761 7.3751 5.27827 7.22826L10.3573 3.95121C10.6829 3.73218 11.0803 4.10885 10.8816 4.45309L9.3103 7.17458L10.9601 8.12708C11.2004 8.26583 11.21 8.60914 10.9824 8.76348L6.00008 12.0531C5.66419 12.2748 5.26678 11.8982 5.46553 11.5539Z"
          fill="white"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1600_23889"
            x1="15.4849"
            y1="17.6236"
            x2="0.399917"
            y2="0.616998"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#002EFF" />
            <stop offset="1" stopColor="#22E1FF" />
          </linearGradient>
        </defs>
      </svg>

      <Typography variant="h6" className="text-white">
        {isZapActive ? (
          <span>
            1 {tokenName} ={' '}
            {quote['toTokenAmount'] &&
              formatAmount(
                getUserReadableAmount(
                  quote['toTokenAmount'],
                  quote['toToken']['decimals']
                ),
                8
              )}{' '}
            {ssovTokenSymbol}{' '}
            <span className="opacity-70">
              (~${formatAmount(selectedTokenPrice, 0)})
            </span>
          </span>
        ) : (
          'Zap In'
        )}
      </Typography>

      {isZapActive ? (
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-1 ml-auto mt-1.5 rotate-90"
        >
          <path
            d="M5.28997 0.70998L0.699971 5.29998C0.309971 5.68998 0.309971 6.31998 0.699971 6.70998C1.08997 7.09998 1.71997 7.09998 2.10997 6.70998L5.99997 2.82998L9.87997 6.70998C10.27 7.09998 10.9 7.09998 11.29 6.70998C11.68 6.31998 11.68 5.68998 11.29 5.29998L6.69997 0.70998C6.31997 0.31998 5.67997 0.31998 5.28997 0.70998Z"
            fill="#8E8E8E"
          />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-0 ml-auto mt-0.5 "
        >
          <path
            d="M8 4.25C7.5875 4.25 7.25 4.5875 7.25 5V7.25H5C4.5875 7.25 4.25 7.5875 4.25 8C4.25 8.4125 4.5875 8.75 5 8.75H7.25V11C7.25 11.4125 7.5875 11.75 8 11.75C8.4125 11.75 8.75 11.4125 8.75 11V8.75H11C11.4125 8.75 11.75 8.4125 11.75 8C11.75 7.5875 11.4125 7.25 11 7.25H8.75V5C8.75 4.5875 8.4125 4.25 8 4.25ZM8 0.5C3.86 0.5 0.5 3.86 0.5 8C0.5 12.14 3.86 15.5 8 15.5C12.14 15.5 15.5 12.14 15.5 8C15.5 3.86 12.14 0.5 8 0.5ZM8 14C4.6925 14 2 11.3075 2 8C2 4.6925 4.6925 2 8 2C11.3075 2 14 4.6925 14 8C14 11.3075 11.3075 14 8 14Z"
            fill="white"
          />
        </svg>
      )}
    </Box>
  );
};

export default ZapInButton;
