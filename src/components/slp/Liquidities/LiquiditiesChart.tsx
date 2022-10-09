import { BigNumber } from 'ethers';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { LiquidityInterface } from 'store/Vault/slp';
import { DECIMALS_STRIKE, DECIMALS_USD } from 'constants/index';
import { formatAmount } from 'utils/general';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

interface Props {
  strike: BigNumber;
  liquidity: LiquidityInterface;
}

const LiquiditiesChart = (strikesLiqs: Props[]) => {
  const data = strikesLiqs
    .filter(
      (obj) =>
        obj.liquidity.write.gt(BigNumber.from(0)) ||
        obj.liquidity.purchase.gt(BigNumber.from(0))
    )
    .map((obj) => {
      return {
        name: `$${formatAmount(
          getUserReadableAmount(obj.strike, DECIMALS_STRIKE),
          2
        )}`,
        'Liquidity Provided': parseFloat(
          formatAmount(
            getUserReadableAmount(obj.liquidity.write, DECIMALS_USD),
            2
          ).replace(/,/g, '')
        ),
        Purchase: parseFloat(
          formatAmount(
            getUserReadableAmount(obj.liquidity.purchase, DECIMALS_USD),
            2
          ).replace(/,/g, '')
        ),
      };
    });

  return data.length > 0 ? (
    <ResponsiveContainer width="99%" aspect={2.5}>
      <BarChart width={650} height={250} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip cursor={{ fill: 'transparent' }} />
        <Legend />
        <Bar dataKey="Liquidity Provided" fill="#1976D2" />
        <Bar dataKey="Purchase" fill="#00BCD4" />
      </BarChart>
    </ResponsiveContainer>
  ) : null;
};

export default LiquiditiesChart;
