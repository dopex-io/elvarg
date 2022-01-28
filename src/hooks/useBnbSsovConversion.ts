import { WalletContext } from 'contexts/Wallet';
import { BigNumber, ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import oneEBigNumber from 'utils/math/oneEBigNumber';

const useBnbSsovConversion = () => {
  const { contractAddresses, provider } = useContext(WalletContext);
  const [oneBnbtoVbnb, setOneBnbtoVbnb] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [oneVbnbtoBnb, setOneVbnbtoBnb] = useState<BigNumber>(
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
      setOneVbnbtoBnb(await bnbSsov.vbnbToBnb(oneEBigNumber(8)));
      setOneBnbtoVbnb(await bnbSsov.bnbToVbnb(oneEBigNumber(18)));
    })();
  }, [contractAddresses.SSOV, provider]);

  const convertToBNB = (amount: BigNumber) => {
    return amount.mul(oneVbnbtoBnb).div(oneEBigNumber(26));
  };

  const convertToVBNB = (amount: BigNumber) => {
    return amount.mul(oneBnbtoVbnb).div(oneEBigNumber(26));
  };

  return {
    convertToBNB,
    convertToVBNB,
  };
};

export default useBnbSsovConversion;
