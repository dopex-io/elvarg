import { create } from 'zustand';

type UNDERLYING_ASSETS = 'ARB' | 'WETH';
type COLLATERAL_ASSETS = 'USDC';
type TV_TICKER = `${UNDERLYING_ASSETS}/${COLLATERAL_ASSETS}`;
type TradingViewChartStore = {
  selectedTicker: TV_TICKER;
  setSelectedTicker: (ticker: TV_TICKER) => void;
};

const useTradingViewChartStore = create<TradingViewChartStore>((set, get) => ({
  selectedTicker: 'ARB/USDC',
  setSelectedTicker(ticker) {
    set((prev) => ({
      ...prev,
      selectedTicker: ticker,
    }));
  },
}));

export default useTradingViewChartStore;
