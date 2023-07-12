const STRIKES_MENU_CONTENT = [['Orderbook', false]];

export const STRIKES_MENU = STRIKES_MENU_CONTENT.map((content) => ({
  textContent: content[0],
  disabled: content[1],
}));
