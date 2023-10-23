import Link from 'next/link';
import { BigNumber } from 'ethers';

import { Divider } from '@mui/material';

import { IOlpApi } from 'pages/olp';

import { NumberDisplay } from 'components/UI';

import { getReadableTime } from 'utils/contracts';

import { CHAINS } from 'constants/chains';

export const FeaturedOlp = ({ olp }: { olp: IOlpApi | undefined }) => {
  if (olp === undefined) return null;

  const splitSymbol = olp.symbol.split('-');

  return (
    <div className="cursor-pointer border border-cod-gray hover:border-wave-blue rounded-lg flex-1 p-1 bg-cod-gray">
      <Link href={`/olp/${olp.symbol}`} target="_blank">
        <div className="flex p-2">
          <div className="w-7 h-7 border border-gray-500 rounded-full mr-2">
            <img
              src={`/images/tokens/${olp.underlyingSymbol.toLowerCase()}.svg`}
              alt={olp.underlyingSymbol}
            />
          </div>
          <div className="text-sm capitalize my-auto">
            {`${splitSymbol[0]} ${splitSymbol[1]?.toLowerCase()}`}
          </div>
          <div className="ml-auto">
            <img
              src={CHAINS[olp.chainId]?.icon}
              alt={CHAINS[olp.chainId]?.name}
              className="w-6 h-auto"
            />
          </div>
        </div>
        <Divider className="fill-current bg-carbon" />
        <div className="flex justify-between rounded-b-lg p-1 mt-1">
          <div className=" flex flex-col flex-1 items-center">
            <div className="text-sm">
              $
              <NumberDisplay n={BigNumber.from(olp.tvl)} decimals={0} />
            </div>
            <div className="text-sm text-stieglitz">TVL</div>
          </div>
          <div className=" flex flex-col flex-1 items-center">
            <div className="text-sm text-wave-blue">
              {olp.tvl === 0
                ? '0'
                : Math.round((olp.utilization / olp.tvl) * 100)}
              %
            </div>
            <div className="text-sm text-stieglitz">Utilization</div>
          </div>
          <div className=" flex flex-col flex-1 items-center">
            <div className="text-sm w-max">{getReadableTime(olp.expiry)}</div>
            <div className="text-sm text-stieglitz">Expiry</div>
          </div>
        </div>
      </Link>
    </div>
  );
};
