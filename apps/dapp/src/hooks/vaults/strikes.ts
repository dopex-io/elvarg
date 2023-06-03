import { useCallback, useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';

import { SsovV3__factory } from '@dopex-io/sdk';
import { Address } from 'viem';
import { readContracts, useContractReads } from 'wagmi';

import {
  getContractReadableAmount,
  getUserReadableAmount,
} from 'utils/contracts';
import {
  getDelta,
  getGamma,
  getRho,
  getTheta,
  getVega,
} from 'utils/math/blackScholes/greeks';

import { DECIMALS_STRIKE, DECIMALS_TOKEN } from 'constants/index';

interface Props {
  contractAddress?: string;
  epoch?: number;
  args?: (string | BigNumber | number)[];
}

export interface EpochStrikeData {
  strike: number;
  totalCollateral: BigNumber;
  availableCollateral: BigNumber;
  activeCollateral: BigNumber;
  premiumsAccrued: BigNumber;
  premiumPerOption: BigNumber;
  availableCollateralPercentage: number;
  totalAvailableCollateral: number;
  totalPurchased: number;
}

export interface Greeks {
  delta: number;
  gamma: number;
  rho: number;
  iv: number;
  theta: number;
  vega: number;
  strike: number;
}

const useFetchStrikes = (props: Props) => {
  const { contractAddress, epoch } = props;
  const { data, isLoading, error } = useContractReads({
    contracts: [
      {
        abi: SsovV3__factory.abi,
        address: contractAddress as Address,
        functionName: 'getEpochData',
        args: [BigNumber.from(epoch || 1)],
      },
      {
        abi: SsovV3__factory.abi,
        address: contractAddress as Address,
        functionName: 'getUnderlyingPrice',
      },
      {
        abi: SsovV3__factory.abi,
        address: contractAddress as Address,
        functionName: 'isPut',
      },
    ],
  });

  const [ivs, setIvs] = useState<BigNumber[]>([]);
  const [epochStrikeData, setEpochStrikeData] = useState<
    (EpochStrikeData & Greeks)[]
  >([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const updateIvs = useCallback(async () => {
    if (!contractAddress || !data || !data[0]) return;
    const ivs = [];
    for (let i = 0; i < data[0].strikes.length; i++) {
      const iv = (
        await readContracts({
          contracts: [
            {
              address: contractAddress as any,
              abi: SsovV3__factory.abi,
              functionName: 'getVolatility',
              args: [data[0].strikes[i]],
            },
          ],
        })
      )[0];
      ivs.push(iv);
    }
    setIvs(ivs);
  }, [contractAddress, data]);

  const greeks: Greeks[] | undefined = useMemo(() => {
    if (
      !data ||
      !data[0] ||
      data[0].expiry === null ||
      !contractAddress ||
      !ivs
    )
      return [];

    try {
      return data[0].strikes.map((strike, index) => {
        const _strike = getUserReadableAmount(strike, DECIMALS_STRIKE);
        const expiryInYears =
          data[0].expiry.sub(data[0].startTime).toNumber() / 31556926;
        const spot = getUserReadableAmount(data[1], DECIMALS_STRIKE);
        const isPut = data[2];
        const iv = ivs[index].toNumber();

        const delta = getDelta(spot, _strike, expiryInYears, iv, 0, isPut);
        const gamma = getGamma(spot, _strike, expiryInYears, iv, 0);
        const vega = getVega(spot, _strike, expiryInYears, iv, 0);
        const theta = getTheta(spot, _strike, expiryInYears, iv, 0, isPut, 365);
        const rho = getRho(spot, _strike, expiryInYears, iv, 0, isPut, 100);

        return {
          delta,
          gamma,
          theta,
          vega,
          rho,
          iv,
          strike: _strike,
        };
      });
    } catch (e) {
      console.log('Something went wrong fetching strikes', e);
      return;
    }
  }, [data, contractAddress, ivs]);

  const constructEpochStrikeChain = useCallback(async () => {
    if (
      !epoch ||
      ivs.length === 0 ||
      !greeks ||
      greeks.length === 0 ||
      !greeks ||
      !data ||
      !data[0].expiry
    )
      return;

    const strikes = data[0].strikes;
    const config = {
      address: contractAddress as any,
      abi: SsovV3__factory.abi,
    };
    let _epochStrikeData: (Greeks & EpochStrikeData)[] = [];
    for (let i = 0; i < strikes.length; i++) {
      const [strikeData, premiumPerOption] = await readContracts({
        contracts: [
          {
            ...config,
            functionName: 'getEpochStrikeData',
            args: [BigNumber.from(epoch), strikes[i]],
          },
          {
            ...config,
            functionName: 'calculatePremium',
            args: [
              strikes[i],
              getContractReadableAmount(1, 18),
              data[0].expiry,
            ],
          },
        ],
      });
      if (!strikeData) return;

      const availableCollateralPercentage =
        ((getUserReadableAmount(strikeData.totalCollateral, DECIMALS_TOKEN) -
          getUserReadableAmount(strikeData.activeCollateral, DECIMALS_TOKEN)) /
          getUserReadableAmount(strikeData.totalCollateral, DECIMALS_TOKEN)) *
          100 || 0;
      const totalAvailable = getUserReadableAmount(
        strikeData.totalCollateral
          .sub(strikeData.activeCollateral)
          .div(data[0].collateralExchangeRate ?? '1'),
        10
      );
      const totalPurchased = getUserReadableAmount(
        strikeData.activeCollateral.div(data[0].collateralExchangeRate ?? '1'),
        10
      );
      _epochStrikeData.push({
        totalCollateral: strikeData.totalCollateral,
        availableCollateral: strikeData.totalCollateral.sub(
          strikeData.activeCollateral
        ),
        activeCollateral: strikeData.activeCollateral,
        premiumsAccrued: strikeData.totalPremiums,
        premiumPerOption,
        availableCollateralPercentage,
        totalAvailableCollateral: totalAvailable,
        totalPurchased: totalPurchased,
        ...greeks[i],
      });
    }
    setEpochStrikeData(_epochStrikeData);
    setActiveIndex(0);
  }, [contractAddress, data, epoch, greeks, ivs, setActiveIndex]);

  useEffect(() => {
    updateIvs();
  }, [updateIvs]);

  useEffect(() => {
    constructEpochStrikeChain();
  }, [constructEpochStrikeChain]);

  return {
    data,
    isLoading,
    error,
    epochStrikeData,
    constructEpochStrikeChain,
    activeIndex,
    setActiveIndex,
  };
};

export default useFetchStrikes;
