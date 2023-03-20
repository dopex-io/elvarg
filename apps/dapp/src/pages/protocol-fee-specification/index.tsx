import { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import {
  AtlanticStraddleV2__factory,
  AtlanticStraddle__factory,
} from '@dopex-io/sdk';
import { BigNumber, ethers } from 'ethers';
import { providers } from '@0xsequence/multicall';

import AppBar from 'components/common/AppBar';

import { DOPEX_API_BASE_URL } from 'constants/env';
import { CHAINS } from 'constants/chains';

import createChunks from 'utils/general/createChunks';

interface SsovCardProps {
  name: string;
  tokenSymbol: string;
  duration: string;
  type: string;
  purchaseFeePercentage: BigNumber;
  settlementFeePercentage: BigNumber;
}

const SsovCard = ({
  name,
  tokenSymbol,
  duration,
  type,
  purchaseFeePercentage,
  settlementFeePercentage,
}: SsovCardProps) => {
  return (
    <a href={`/ssov/${name}`} target="_blank" rel="noopener noreferrer">
      <div className="bg-umbra shadow-2xl p-4 rounded-2xl hover:-translate-y-1 transition ease-in hover:backdrop-blur-sm hover:bg-opacity-60 cursor-pointer hover:border-wave-blue border-2 border-transparent">
        <div className="flex space-x-3 items-center mb-3">
          <img
            alt={name}
            src={`/images/tokens/${tokenSymbol.toLowerCase()}.svg`}
            className="h-8 w-auto"
          />
          <div className="font-bold capitalize">
            {tokenSymbol} {duration}
          </div>
          <img
            src={`/images/misc/${type === 'call' ? 'calls.svg' : 'puts.svg'}`}
            alt="option-type"
            className="h-6 w-auto"
          />
        </div>
        <div className="font-bold">
          Purchase Fee: {ethers.utils.formatUnits(purchaseFeePercentage, 8)}%{' '}
          <span className="text-xs"> of underlying price per option</span>
        </div>
        <div className="font-bold">
          Settlement Fee: {ethers.utils.formatUnits(settlementFeePercentage, 8)}
          % <span className="text-xs"> of PnL</span>
        </div>
      </div>
    </a>
  );
};

interface StraddleCardProps {
  name: string;
  tokenSymbol: string;
  purchaseFeePercentage: BigNumber;
  settlementFeePercentage: BigNumber;
}

const StraddleCard = ({
  name,
  tokenSymbol,
  purchaseFeePercentage,
  settlementFeePercentage,
}: StraddleCardProps) => {
  return (
    <a
      href={`/straddles/${tokenSymbol}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="bg-umbra shadow-2xl p-4 rounded-2xl hover:-translate-y-1 transition ease-in hover:backdrop-blur-sm hover:bg-opacity-60 cursor-pointer hover:border-wave-blue border-2 border-transparent">
        <div className="flex space-x-3 items-center mb-3">
          <img
            alt={name}
            src={`/images/tokens/${tokenSymbol.toLowerCase()}.svg`}
            className="h-8 w-auto"
          />
          <div className="font-bold capitalize">{tokenSymbol}</div>
        </div>

        <div className="font-bold">
          Purchase Fee: {ethers.utils.formatUnits(purchaseFeePercentage, 6)}%{' '}
          <span className="text-xs"> of underlying price per option</span>
        </div>
        <div className="font-bold">
          Settlement Fee: {ethers.utils.formatUnits(settlementFeePercentage, 6)}
          % <span className="text-xs"> of PnL</span>
        </div>
      </div>
    </a>
  );
};

const FeeSpecification = () => {
  const [ssovs, setSsovs] = useState<any[]>([]);
  const [straddles, setStraddles] = useState<any[]>([]);

  useEffect(() => {
    async function updateSsovsData() {
      const response = await axios.get(
        `${DOPEX_API_BASE_URL}/v2/ssov?groupBy=none`
      );

      let _ssovs = Object.keys(response.data).map((k) => response.data[k]);

      const data = await Promise.all(
        _ssovs.map((ssov: { address: string; chainId: number }) => {
          const feeStrategy = new ethers.Contract(
            ssov.chainId === 137
              ? '0xeCf52d848178444d3cd5EBF9bD6F124EBEB42440'
              : '0x8C73B6D3C81C6CC42e8285c8C147a7563d71Add0',
            [
              'function getSsovFeeStructure(address ssov) view returns (uint256 purchaseFeePercentage, uint256 settlementFeePercentage)',
            ],
            new providers.MulticallProvider(
              new ethers.providers.StaticJsonRpcProvider(
                CHAINS[ssov.chainId]?.rpc!
              )
            )
          );

          return feeStrategy['getSsovFeeStructure'](ssov.address);
        })
      );

      _ssovs = _ssovs.map((s, i) => {
        return {
          ...s,
          purchaseFeePercentage: data[i].purchaseFeePercentage,
          settlementFeePercentage: data[i].settlementFeePercentage,
        };
      });

      setSsovs(_ssovs);
    }

    updateSsovsData();

    async function updateStraddlesData() {
      const response = await axios.get(`${DOPEX_API_BASE_URL}/v2/straddles`);

      let _straddles = response.data[42161];

      let data = await Promise.all(
        response.data[42161]
          .map((straddle: { address: string }) => {
            const contract = AtlanticStraddle__factory.connect(
              straddle.address,
              new providers.MulticallProvider(
                new ethers.providers.StaticJsonRpcProvider(CHAINS[42161]?.rpc!)
              )
            );

            return [
              contract.purchaseFeePercent(),
              contract.settlementFeePercent(),
            ];
          })
          .flat()
      );

      data = createChunks(data, 2);

      _straddles = _straddles.map((s: any, i: number) => {
        return {
          ...s,
          purchaseFeePercentage: data[i][0],
          settlementFeePercentage: data[i][1],
        };
      });

      const maticStraddleVaultVariables =
        await AtlanticStraddleV2__factory.connect(
          response.data[137][0].address,
          new providers.MulticallProvider(
            new ethers.providers.StaticJsonRpcProvider(CHAINS[137]?.rpc!)
          )
        ).vaultVariables();

      _straddles.push({
        ...response.data[137][0],
        purchaseFeePercentage: maticStraddleVaultVariables.purchaseFeePercent,
        settlementFeePercentage:
          maticStraddleVaultVariables.settlementFeePercent,
      });

      setStraddles(_straddles);
    }

    updateStraddlesData();
  }, []);

  return (
    <div className="min-h-screen">
      <Head>
        <title>Fee Specification | Dopex</title>
      </Head>
      <AppBar />
      <div className="pb-28 pt-40 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0 to-">
        <div className="mb-8 font-bold text-lg">
          Single Staking Option Vaults
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-8 mb-8">
          {ssovs.map((s) => {
            return (
              <SsovCard
                key={s.symbol}
                name={s.symbol}
                tokenSymbol={s.underlyingSymbol}
                duration={s.duration}
                type={s.type}
                purchaseFeePercentage={s.purchaseFeePercentage}
                settlementFeePercentage={s.settlementFeePercentage}
              />
            );
          })}
        </div>
        <div className="mb-8 font-bold text-lg">Atlantic Straddles</div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
          {straddles.map((s) => {
            return (
              <StraddleCard
                key={s.symbol}
                name={s.symbol}
                tokenSymbol={s.underlyingSymbol}
                purchaseFeePercentage={s.purchaseFeePercentage}
                settlementFeePercentage={s.settlementFeePercentage}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeeSpecification;
