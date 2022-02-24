import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { WalletContext } from 'contexts/Wallet';
import { BigNumber, ethers } from 'ethers';
import oneEBigNumber from 'utils/math/oneEBigNumber';

export const BnbConversionContext = createContext<any>({});

export const BnbConversionProvider = (props) => {
  const { contractAddresses, provider } = useContext(WalletContext);
  const [oneBnbToVbnb, setOneBnbToVbnb] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [oneVbnbToBnb, setOneVbnbToBnb] = useState<BigNumber>(
    BigNumber.from(0)
  );

  useEffect(() => {
    if (!contractAddresses.SSOV.BNB || !provider) return;

    (async () => {
      const abi = [
        'function bnbToVbnb(uint256 bnbAmount) public view returns (uint256)',
        ' function vbnbToBnb(uint256 vbnbAmount) public view returns (uint256)',
      ];
      const bnbSsov = new ethers.Contract(
        contractAddresses.SSOV.BNB.Vault,
        abi,
        provider
      );
      setOneVbnbToBnb(await bnbSsov.vbnbToBnb(oneEBigNumber(8)));
      setOneBnbToVbnb(await bnbSsov.bnbToVbnb(oneEBigNumber(18)));
    })();
  }, [contractAddresses, provider]);

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
