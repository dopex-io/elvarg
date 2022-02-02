import Box from '@material-ui/core/Box';
import Typography from '../UI/Typography';
import formatAmount from '../../utils/general/formatAmount';
import getUserReadableAmount from '../../utils/contracts/getUserReadableAmount';
import ZapIcon from '../Icons/ZapIcon';
import PlusIcon from '../Icons/PlusIcon';
import ArrowUpIcon from '../Icons/ArrowUpIcon';

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
      <ZapIcon className="mt-1 mr-2.5" />

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
        <ArrowUpIcon className="mr-1 ml-auto mt-1.5 rotate-90" />
      ) : (
        <PlusIcon className="mr-0 ml-auto mt-0.5" />
      )}
    </Box>
  );
};

export default ZapInButton;
