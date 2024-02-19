const getPositionManagerAddress = (chainId: number) => {
  if (chainId === 42161) {
    return '0xe4ba6740af4c666325d49b3112e4758371386adc';
  }
};


export default getPositionManagerAddress;