import { useCallback, useEffect, useState } from 'react';

import { Menu } from '@dopex-io/ui';
import { useBoundStore } from 'store';

import { DurationType } from 'store/Vault/vault';

const TOKEN_OPTIONS = [
  {
    textContent: 'ETH',
    disabled: false,
  },
  {
    textContent: 'ARB',
    disabled: false,
  },
  {
    textContent: 'DPX',
    disabled: false,
  },
  {
    textContent: 'RDPX',
    disabled: false,
  },
  {
    textContent: 'STETH',
    disabled: false,
  },
  {
    textContent: 'CVX',
    disabled: false,
  },
  {
    textContent: 'CRV',
    disabled: false,
  },
  {
    textContent: 'GOHM',
    disabled: false,
  },
  {
    textContent: 'BTC',
    disabled: false,
  },
  {
    textContent: 'GMX',
    disabled: false,
  },
];
// const vaultOptions = [
//   {
//     textContent: 'SSOV',
//     disabled: false,
//   },
//   {
//     textContent: 'IROV',
//     disabled: true,
//   },
// ];

const TitleBar = () => {
  const { updateBase } = useBoundStore();

  const [selectedToken, setSelectedToken] = useState<string>();

  const handleSelectToken = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateBase(e.target.innerText.toUpperCase());
      setSelectedToken(e.target.innerText);
    },
    [updateBase]
  );

  useEffect(() => {
    if (!selectedToken) {
      const cache: {
        state: {
          filter: { base: string; isPut: boolean; durationType: DurationType };
          version: number;
        };
      } = JSON.parse(
        localStorage.getItem('app.dopex.io/vaults/cache') || 'ETH'
      );
      if (!cache.state.filter.base) return;
      updateBase(cache.state.filter.base.toUpperCase());
      setSelectedToken(cache.state.filter.base.toUpperCase());
    }
  }, [selectedToken, updateBase]);

  return (
    <div className="flex space-x-4 relative w-fit">
      <img
        src={`/images/tokens/${selectedToken}.svg`}
        className="w-[38px] h-[38px] my-auto border rounded-full border-carbon"
        alt={selectedToken}
      />
      <div className="absolute z-20 left-10">
        <Menu
          color="mineshaft"
          dropdownVariant="icon"
          handleSelection={handleSelectToken}
          selection={selectedToken}
          data={TOKEN_OPTIONS}
        />
      </div>
    </div>
  );
};

export default TitleBar;
