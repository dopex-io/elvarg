import { create } from 'zustand';

type TradingViewChartStore = {
  selectedTicker: string;
  setSelectedTicker: (ticker: string) => void;
};

const useTradingViewChartStore = create<TradingViewChartStore>((set, get) => ({
  selectedTicker: 'WETH/USDC',
  setSelectedTicker(ticker) {
    set((prev) => ({
      ...prev,
      selectedTicker: ticker,
    }));
  },
}));

export default useTradingViewChartStore;
