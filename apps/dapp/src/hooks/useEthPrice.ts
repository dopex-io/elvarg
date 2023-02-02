import { useState, useEffect } from 'react';
import axios from 'axios';

const useEthPrice = () => {
  const [ethPrice, setEthPrice] = useState(0);

  useEffect(() => {
    (async function () {
      const results = await Promise.all([
        axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        ),
      ]);
      setEthPrice(results[0].data.ethereum.usd);
    })();
  }, []);

  return ethPrice;
};

export default useEthPrice;
