import { createContext, useCallback, useEffect, useState } from 'react';
import { Addresses } from '@dopex-io/sdk';
import { BigNumber, ethers } from 'ethers';

import oneEBigNumber from 'utils/math/oneEBigNumber';

import { CHAIN_ID_TO_PROVIDERS } from 'contexts/Wallet';

export const BnbConversionContext = createContext<any>({});

export const BnbConversionProvider = (props) => {
  const [oneBnbToVbnb, setOneBnbToVbnb] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [oneVbnbToBnb, setOneVbnbToBnb] = useState<BigNumber>(
    BigNumber.from(0)
  );

  useEffect(() => {
    (async () => {
      const abi = [
        'function bnbToVbnb(uint256 bnbAmount) public view returns (uint256)',
        ' function vbnbToBnb(uint256 vbnbAmount) public view returns (uint256)',
      ];
      const bnbSsov = new ethers.Contract(
        Addresses[56].SSOV.BNB.Vault,
        abi,
        ethers.getDefaultProvider(CHAIN_ID_TO_PROVIDERS[56])
      );
      setOneVbnbToBnb(await bnbSsov.vbnbToBnb(oneEBigNumber(8)));
      setOneBnbToVbnb(await bnbSsov.bnbToVbnb(oneEBigNumber(18)));
    })();
  }, []);

  const convertToBNB = useCallback(
    (amount: BigNumber) => {
      return amount.mul(oneVbnbToBnb).div(oneEBigNumber(26));
    },
    [oneVbnbToBnb]
  );

  const convertToVBNB = useCallback(
    (amount: BigNumber) => {
      return amount.mul(oneBnbToVbnb).div(oneEBigNumber(26));
    },
    [oneBnbToVbnb]
  );
  const contextValue = {
    convertToBNB,
    convertToVBNB,
  };

  return (
    <BnbConversionContext.Provider value={contextValue}>
      {props.children}
    </BnbConversionContext.Provider>
  );
};
