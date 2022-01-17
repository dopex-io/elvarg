import { WalletContext } from 'contexts/Wallet';
import { BigNumber, ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import oneEBigNumber from 'utils/math/oneEBigNumber';

const useBnbSsovConversion = () => {
  const { contractAddresses, provider } = useContext(WalletContext);
  const [oneBnbtoVbnb, setOneBnbtoVbnb] = useState<String>('0');
  const [oneVbnbtoBnb, setOneVbnbtoBnb] = useState<String>('0');
  const [abi] = useState([
    'function bnbToVbnb(uint256 bnbAmount) public view returns (uint256)',
    ' function vbnbToBnb(uint256 vbnbAmount) public view returns (uint256)',
  ]);
  const [contract] = useState(
    new ethers.Contract(contractAddresses.SSOV.BNB.Vault, abi, provider)
  );

  useEffect(() => {
    if (!contractAddresses.SSOV.BNB || !provider) return;

    (async () => {
      setOneVbnbtoBnb((await contract.vbnbToBnb(oneEBigNumber(8))).toString());
      setOneBnbtoVbnb((await contract.bnbToVbnb(oneEBigNumber(18))).toString());
    })();
  }, [contractAddresses.SSOV, provider, abi, contract]);

  const convertToBNB = (amount: number) => {
    return (amount * Number(oneVbnbtoBnb)) / 1e26;
  };

  const convertToVBNB = (amount: number) => {
    return (amount * Number(oneBnbtoVbnb)) / 1e26;
  };

  const convertVbnbToBnbRaw = async (amount: BigNumber) => {
    return await contract.vbnbToBnb(amount);
  };
  return {
    convertVbnbToBnbRaw,
    convertToBNB,
    convertToVBNB,
  };
};

export default useBnbSsovConversion;
