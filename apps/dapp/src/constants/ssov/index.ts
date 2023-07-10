const STRIKES_MENU_CONTENT = [
  ['Orderbook', false],
  ['Etherscan', true],
];

export const STRIKES_MENU = STRIKES_MENU_CONTENT.map((content) => ({
  textContent: content[0],
  disabled: content[1],
}));
