import { Address, parseUnits } from 'viem';

import { OptionPools__factory } from '@dopex-io/sdk';
import { multicall } from 'wagmi/actions';

import { EXPIRIES_BY_INDEX } from 'constants/clamm';

import { TickData } from './parseTickData';

export type PremiumWithTtl = {
  [TTL in typeof EXPIRIES_BY_INDEX as string]: bigint;
};

export type TickDataWithPremiums = TickData & {
  putPremiums: PremiumWithTtl;
  callPremiums: PremiumWithTtl;
};

async function getTicksPremiumAndBreakeven(
  optionsPoolAddress: Address,
  uniswapPoolAddress: Address,
  callAssetDecimals: number,
  putAssetDecimals: number,
  ticksData: TickData[],
): Promise<TickDataWithPremiums[]> {
  const optionsPoolContract = {
    address: optionsPoolAddress,
    abi: OptionPools__factory.abi,
  };

  const ttls = EXPIRIES_BY_INDEX;

  const ttlMultiCall: ({
    functionName: string;
    args: any[];
  } & typeof optionsPoolContract)[] = [];

  // TTL calls
  for (let i = 0; i < ttls.length; i++) {
    ttlMultiCall.push({
      ...optionsPoolContract,
      functionName: 'ttlToVEID',
      args: [ttls[i]],
    });
  }

  const ttlEndIndex = ttlMultiCall.length - 1;

  // Current price call
  ttlMultiCall.push({
    ...optionsPoolContract,
    functionName: 'getCurrentPricePerCallAsset',
    args: [uniswapPoolAddress],
  });

  const multiCall1Result = await multicall({
    contracts: ttlMultiCall,
  });

  const spotPrice = multiCall1Result[ttlEndIndex + 1].result;
  const ttlIvs = multiCall1Result
    .slice(0, -1)
    .map(({ result }) => result) as bigint[];

  const premiumsMultiCalls: typeof ttlMultiCall = [];

  const blockTimestamp = BigInt((new Date().getTime() / 1000).toFixed(0));

  //   Put premiums
  for (let i = 0; i < ticksData.length; i++) {
    const { tickLowerPrice } = ticksData[i];
    const tickLowerPriceParsed = parseUnits(
      tickLowerPrice.toString(),
      putAssetDecimals,
    );

    for (let j = 0; j < ttlIvs.length; j++) {
      premiumsMultiCalls.push({
        ...optionsPoolContract,
        functionName: 'getPremiumAmount',
        args: [
          true,
          blockTimestamp + BigInt(ttls[j]),
          tickLowerPriceParsed,
          spotPrice,
          ttlIvs[j],
          tickLowerPriceParsed,
        ],
      });
    }
  }

  // Call premiums
  for (let i = 0; i < ticksData.length; i++) {
    const { tickUpperPrice } = ticksData[i];
    const tickUpperParsed = parseUnits(
      tickUpperPrice.toString(),
      putAssetDecimals,
    );

    for (let j = 0; j < ttlIvs.length; j++) {
      premiumsMultiCalls.push({
        ...optionsPoolContract,
        functionName: 'getPremiumAmount',
        args: [
          false,
          blockTimestamp + BigInt(ttls[j]),
          tickUpperParsed,
          spotPrice,
          ttlIvs[j],
          parseUnits('1', callAssetDecimals),
        ],
      });
    }
  }

  const putPremiumMultiCall = await multicall({
    contracts: premiumsMultiCalls,
  });

  const premiums = putPremiumMultiCall.map(({ result }) => result) as bigint[];
  const putPremiums = premiums.slice(0, premiums.length / 2);
  const callPremiums = premiums.slice(premiums.length / 2);

  const putPremiumsWithTtl: PremiumWithTtl[] = [];
  const callPremiumsWithTtl: PremiumWithTtl[] = [];

  for (let i = 0; i < putPremiums.length; i += ttls.length) {
    let x = {};
    for (let j = 0; j < ttlIvs.length; j++) {
      x = {
        ...x,
        [ttls[j].toString()]: putPremiums[i + j],
      };
    }
    putPremiumsWithTtl.push(x);
  }

  for (let i = 0; i < callPremiums.length; i += ttls.length) {
    let x = {};
    for (let j = 0; j < ttlIvs.length; j++) {
      x = {
        ...x,
        [ttls[j].toString()]: callPremiums[i + j],
      };
    }
    callPremiumsWithTtl.push(x);
  }

  const ticksDataWithPremiums = ticksData.map((data, index) => {
    return {
      ...data,
      putPremiums: putPremiumsWithTtl[index],
      callPremiums: callPremiumsWithTtl[index],
    };
  });

  return ticksDataWithPremiums;
}

export default getTicksPremiumAndBreakeven;
