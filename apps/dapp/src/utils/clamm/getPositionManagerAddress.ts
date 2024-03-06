const getPositionManagerAddress = (chainId: number) => {
  if (chainId === 42161) {
    return '0xe4ba6740af4c666325d49b3112e4758371386adc';
  }

  if (chainId === 5000) {
    return '0xE4bA6740aF4c666325D49B3112E4758371386aDc';
  }
};

export default getPositionManagerAddress;
