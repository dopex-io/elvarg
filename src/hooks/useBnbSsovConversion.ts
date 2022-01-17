import { WalletContext } from 'contexts/Wallet';
import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import oneEBigNumber from 'utils/math/oneEBigNumber';

const useBnbSsovConversion = () => {
  const { contractAddresses, provider } = useContext(WalletContext);
  const [oneBnbtoVbnb, setOneBnbtoVbnb] = useState<String>('0');
  const [oneVbnbtoBnb, setOneVbnbtoBnb] = useState<String>('0');

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
      setOneVbnbtoBnb((await bnbSsov.vbnbToBnb(oneEBigNumber(8))).toString());
      setOneBnbtoVbnb((await bnbSsov.bnbToVbnb(oneEBigNumber(18))).toString());
    })();
  }, [contractAddresses.SSOV, provider]);

  const convertToBNB = (amount: number) => {
    return (amount * Number(oneVbnbtoBnb)) / 1e26;
  };

  const convertToVBNB = (amount: number) => {
    return (amount * Number(oneBnbtoVbnb)) / 1e26;
  };

  return {
    convertToBNB,
    convertToVBNB,
  };
};

export default useBnbSsovConversion;
