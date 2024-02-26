import { Address } from 'viem';

const getOptionMarketPairPools = (
  chainId: number,
  optionMarket: string,
): Address[] => {
  if (chainId === 42161) {
    if (
      // WETH - USDC
      optionMarket.toLowerCase() ===
      '0x501b03bdb431154b8df17bf1c00756e3a8f21744'
    ) {
      // [uniswapV3]
      return ['0xc6962004f452be9203591991d15f6b388e09e8d0'];
    } else if (
      // WBTC - USDC
      optionMarket.toLowerCase() ===
      '0x550e7e236912daa302f7d5d0d6e5d7b6ef191f04'
    ) {
      // [uniswapV3]
      return ['0x0e4831319a50228b9e450861297ab92dee15b44f'];
    } else if (
      // ARB - USDC
      optionMarket.toLowerCase() ===
      '0x4eed3a2b797bf5630517ecce2e31c1438a76bb92'
    ) {
      // [uniswapV3]
      return ['0xb0f6ca40411360c03d41c5ffc5f179b8403cdcf8'];
    } else if (
      // WETH - USDC.e
      optionMarket.toLowerCase() ===
      '0x764fa09d0b3de61eed242099bd9352c1c61d3d27'
    ) {
      // [uniswapV3]
      return ['0xc31e54c7a869b9fcbecc14363cf510d1c41fa443'];
    } else if (
      // ARB - USDC.e
      optionMarket.toLowerCase() ===
      '0x77b6f45a3dcf0493f1b9ac9874e5982ab526aa9e'
    ) {
      // [uniswapV3]
      return ['0xcda53b1f66614552f834ceef361a8d12a0b8dad8'];
    } else if (
      // WBTC - USDC.e
      optionMarket.toLowerCase() ===
      '0x3808e8c983023a125ffe2714e2a703a3bf02be0d'
    ) {
      // [uniswapV3]
      return ['0xac70bd92f89e6739b3a08db9b6081a923912f73d'];
    } else return [];
  } else return [];
};

export default getOptionMarketPairPools;
