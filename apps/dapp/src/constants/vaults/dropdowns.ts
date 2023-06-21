const VALID_TOKENS = [
  ['ETH', true],
  ['ARB', false],
  ['DPX', false],
  ['RDPX', false],
  ['STETH', false],
  ['CVX', false],
  ['CRV', false],
  ['GOHM', false],
  ['BTC', false],
  ['GMX', false],
];

export const VAULTS_MENU = VALID_TOKENS.map((content) => ({
  textContent: content[0],
  isDisabled: content[1],
}));

const STRIKES_MENU_CONTENT = [
  ['Orderbook', false],
  ['Etherscan', true],
];

export const STRIKES_MENU = STRIKES_MENU_CONTENT.map((content) => ({
  textContent: content[0],
  disabled: content[1],
}));
