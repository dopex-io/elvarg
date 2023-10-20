import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Menu } from '@dopex-io/ui';

type CALL_ASSET = 'ARB' | 'ETH' | 'BTC';
type PUT_ASSET = 'USDC';
type PairTextContent = `${CALL_ASSET} - ${PUT_ASSET}`;
type Pair = {
  textContent: PairTextContent;
  callAsset: CALL_ASSET;
  putAsset: PUT_ASSET;
};
const CLAMM_PAIRS: Pair[] = [
  {
    textContent: 'ARB - USDC',
    callAsset: 'ARB',
    putAsset: 'USDC',
  },
  {
    textContent: 'ETH - USDC',
    callAsset: 'ETH',
    putAsset: 'USDC',
  },
  {
    textContent: 'BTC - USDC',
    callAsset: 'BTC',
    putAsset: 'USDC',
  },
];

const parsePairFromParams = (params: { pair: PairTextContent[] }) => {
  if (!params) return;
  let { pair } = params;
  if (!pair) return;
  const pairFound = CLAMM_PAIRS.find(
    ({ textContent }) =>
      pair[0].toLowerCase() === textContent.toLowerCase().replaceAll(' ', ''),
  );
  if (pairFound) {
    return pairFound;
  }
};

const PairSelector = () => {
  const params = useParams<{ pair: PairTextContent[] }>();
  const router = useRouter();

  const [selectedPair, setSelectedPair] = useState<Pair>(
    parsePairFromParams(params) ?? {
      textContent: 'ARB - USDC',
      callAsset: 'ARB',
      putAsset: 'USDC',
    },
  );

  return (
    <div className="flex flex-col space-y-[8px] justify-center">
      <span className="text-md font-normal text-stieglitz">Select Pair</span>
      <div className="flex space-x-[12px]">
        <div className="flex -space-x-4 self-center">
          <img
            className="w-[40px] h-[40px] z-10 border border-gray-500 rounded-full"
            src={`/images/tokens/${selectedPair.callAsset.toLowerCase()}.svg`}
            alt={selectedPair.callAsset.toLowerCase()}
          />
          <img
            className="w-[40px] h-[40px]"
            src={`/images/tokens/${selectedPair.putAsset.toLowerCase()}.svg`}
            alt={selectedPair.putAsset.toLowerCase()}
          />
        </div>
        <Menu
          color="mineshaft"
          dropdownVariant="icon"
          setSelection={(T: Pair) => {
            router.replace(T.textContent.replaceAll(' ', ''));
            setSelectedPair(T);
          }}
          selection={selectedPair}
          data={CLAMM_PAIRS.filter(
            ({ textContent }) => textContent !== selectedPair.textContent,
          )}
          showArrow
        />
      </div>
    </div>
  );
};

export default PairSelector;
