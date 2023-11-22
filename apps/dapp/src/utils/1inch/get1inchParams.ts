import { BigNumber, ethers } from 'ethers';

const oneInchRouterAbi = JSON.parse(
  '[{"inputs":[{"internalType":"contract IAggregationExecutor","name":"executor","type":"address"},{"components":[{"internalType":"address","name":"srcToken","type":"address"},{"internalType":"address","name":"dstToken","type":"address"},{"internalType":"address payable","name":"srcReceiver","type":"address"},{"internalType":"address payable","name":"dstReceiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minReturnAmount","type":"uint256"},{"internalType":"uint256","name":"flags","type":"uint256"}],"internalType":"struct SwapDescription","name":"desc","type":"tuple"},{"internalType":"bytes","name":"permit","type":"bytes"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"},{"internalType":"uint256","name":"spentAmount","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minReturn","type":"uint256"},{"internalType":"uint256[]","name":"pools","type":"uint256[]"}],"name":"uniswapV3Swap","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"srcToken","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minReturn","type":"uint256"},{"internalType":"uint256[]","name":"pools","type":"uint256[]"}],"name":"unoswap","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"}],"stateMutability":"payable","type":"function"}]'
);

const emptyUnoswapParams = {
  srcToken: '0x0000000000000000000000000000000000000000',
  amount: BigNumber.from('0'),
  minReturn: BigNumber.from('0'),
  pools: [],
};
const emptyUniswapV3Params = {
  amount: BigNumber.from('0'),
  minReturn: BigNumber.from('0'),
  pools: [],
};

const emptySwapParams = [
  '0x0000000000000000000000000000000000000000',
  [
    '0x0000000000000000000000000000000000000000',
    '0x0000000000000000000000000000000000000000',
    '0x0000000000000000000000000000000000000000',
    '0x0000000000000000000000000000000000000000',
    BigNumber.from('0'),
    BigNumber.from('0'),
    BigNumber.from('0'),
  ],
  '0x',
  '0x',
];

const get1inchParams = (data: ethers.utils.BytesLike) => {
  const routerV5 = new ethers.Contract(
    '0x1111111254EEB25477B68fb85Ed929f73A960582',
    oneInchRouterAbi
  );

  let params;
  let type;
  let purchaseParams;

  try {
    params = routerV5.interface.decodeFunctionData('swap', data);
    type = 'swap';
    purchaseParams = {
      swapId: 2,
      unoswapParams: emptyUnoswapParams,
      uniswapV3Params: emptyUniswapV3Params,
      swapParams: {
        executor: params['executor'],
        desc: {
          srcToken: params['desc']['srcToken'],
          dstToken: params['desc']['dstToken'],
          srcReceiver: params['desc']['srcReceiver'],
          dstReceiver: params['desc']['dstReceiver'],
          amount: 1,
          minReturnAmount: 1,
          flags: params['desc']['flags'],
        },
        permit: params['permit'],
        data: params['data'],
      },
    };
  } catch {
    try {
      params = routerV5.interface.decodeFunctionData('uniswapV3Swap', data);
      type = 'uniswapV3Swap';
      purchaseParams = {
        swapId: 1,
        unoswapParams: emptyUnoswapParams,
        uniswapV3Params: {
          amount: BigNumber.from('1'),
          minReturn: BigNumber.from('1'),
          pools: params['desc']['pools'],
        },
        swapParams: emptySwapParams,
      };
    } catch {
      params = routerV5.interface.decodeFunctionData('unoswap', data);
      type = 'unoswap';
      purchaseParams = {
        swapId: 0,
        unoswapParams: {
          srcToken: params['desc']['srcToken'],
          amount: BigNumber.from('1'),
          minReturn: BigNumber.from('1'),
          pools: params['desc']['pools'],
        },
        uniswapV3Params: emptyUniswapV3Params,
        swapParams: emptySwapParams,
      };
    }
  }

  return { type, params, purchaseParams };
};

export default get1inchParams;
