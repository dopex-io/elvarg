import { Address } from 'viem';

const getOptionMarketPairPools = (
  chainId: number,
  optionMarket: string,
): Address[] | undefined => {
  optionMarket = optionMarket.toLowerCase();
  if (chainId === 42161) {
    if (
      // WETH - USDC
      optionMarket === '0x501b03bdb431154b8df17bf1c00756e3a8f21744'
    ) {
      // [uniswapV3]
      return ['0xc6962004f452be9203591991d15f6b388e09e8d0'];
    } else if (
      // WBTC - USDC
      optionMarket === '0x550e7e236912daa302f7d5d0d6e5d7b6ef191f04'
    ) {
      // [uniswapV3]
      return ['0x0e4831319a50228b9e450861297ab92dee15b44f'];
    } else if (
      // ARB - USDC
      optionMarket === '0x4eed3a2b797bf5630517ecce2e31c1438a76bb92'
    ) {
      // [uniswapV3]
      return ['0xb0f6ca40411360c03d41c5ffc5f179b8403cdcf8'];
    } else if (
      // WETH - USDC.e
      optionMarket === '0x764fa09d0b3de61eed242099bd9352c1c61d3d27'
    ) {
      // [uniswapV3]
      return ['0xc31e54c7a869b9fcbecc14363cf510d1c41fa443'];
    } else if (
      // ARB - USDC.e
      optionMarket === '0x77b6f45a3dcf0493f1b9ac9874e5982ab526aa9e'
    ) {
      // [uniswapV3]
      return ['0xcda53b1f66614552f834ceef361a8d12a0b8dad8'];
    } else if (
      // WBTC - USDC.e
      optionMarket === '0x3808e8c983023a125ffe2714e2a703a3bf02be0d'
    ) {
      // [uniswapV3]
      return ['0xac70bd92f89e6739b3a08db9b6081a923912f73d'];
    } else return [];
  } else if (chainId === 5000) {
    // USDT / WMNT
    if (optionMarket === '0x1d5de630bbbf68c9bf17d8462605227d79ea910c') {
      return [
        '0xD08C50F7E69e9aeb2867DefF4A8053d9A855e26A', // agni
        '0x262255F4770aEbE2D0C8b97a46287dCeCc2a0AfF', // fusionX
        // '0x0B15691C828fF6D499375e2ca2070B08Dd62369E', // butter
      ];
    } else if (optionMarket === '0x50d31b053c3a099b2cae50eb63848eccf87d72df') {
      return [
        '0x01845ec86909006758DE0D57957D88Da10bf5809', // fusionX
        '0xB301c86b37801ee31448fE09EF271279f6F0B068', // butter
      ];
    } else if (optionMarket === '0xcda890c42365dcb1a8a1079f2f47379ad620bc99') {
      return [
        '0x628f7131CF43e88EBe3921Ae78C4bA0C31872bd4', // agni
        // '0xD801D457D9cC70f6018a62885F03BB70706F59Cc', // butter
      ];
    } else return [];
  } else return [];
};

export default getOptionMarketPairPools;
