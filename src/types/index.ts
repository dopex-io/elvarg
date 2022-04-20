export type AssetData = {
  [key: string]: {
    fullName: string;
    symbol: string;
    _symbol: string;
    price: string;
    address?: string;
    priceUsd?: number;
    priceEth?: number;
    priceBtc?: number;
  };
};
