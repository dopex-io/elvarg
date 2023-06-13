import { HOST_URL } from 'constants/env';

const seo = {
  ssov: {
    url: `${HOST_URL}/ssov`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1684326255/dopex_images/preview_images/ssov_rbhar7.png',
    alt: 'SSOV',
    title: 'SSOV | Dopex Single Staking Options Vault',
    description:
      'Buy options to trade volatility or write options to earn premiums and rewards',
  },
  straddles: {
    url: `${HOST_URL}/straddles`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1684326260/dopex_images/preview_images/straddles_zpcdyo.png',
    alt: 'Straddles',
    title: 'Dopex Atlantic Straddles',
    description:
      'Buy straddles to trade bi-directional volatility or write Atlantic Puts to earn premiums and funding',
  },
  vedpx: {
    url: `${HOST_URL}/governance/vedpx`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1685374223/dopex_images/preview_images/vedpx_ou2nyt.png',
    alt: 'veDPX',
    title: 'veDPX | Escrowed DPX',
    description: 'Lock $DPX to earn yield, fees, and vote',
  },
  zdte: {
    url: `${HOST_URL}/ztde`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1684326258/dopex_images/preview_images/zdte_vano5r.png',
    alt: '0DTE',
    title: '0dte | Dopex Zero Day-to-Expiry options',
    description: 'Trade options spreads that expire on the day of purchase',
  },
  insuredPerpsLP: {
    url: `${HOST_URL}/atlantics`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1684326257/dopex_images/preview_images/insured-perps-lp_raxiiq.png',
    alt: 'Insured Perps',
    title: 'Dopex Atlantic Insured Perps LP',
    description:
      'Set a maximum price you are willing to buy $ETH for while earning premiums and funding',
  },
  insuredPerps: {
    url: `${HOST_URL}/atlantics`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1685374223/dopex_images/preview_images/insured-perps_ak7l2z.png',
    alt: 'Insured Perps',
    title: 'Dopex Atlantic Insured Perps',
    description: 'Open non-liquidatable longs using up to 10x leverage',
  },
  portfolio: {
    url: `${HOST_URL}/portfolio`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1684326256/dopex_images/preview_images/portfolio_iakwvl.png',
    alt: 'Portfolio',
    title: 'Portfolio Page',
    description: 'Check your Dopex positions',
  },
  tzwap: {
    url: `${HOST_URL}/tzwap`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1685374223/dopex_images/preview_images/tzwap_f2gmgz.png',
    alt: 'Tzwap',
    title: 'Tzwap',
    description:
      'Create customizable TWAP buy/sell orders to minimize slippage on high volume transactions',
  },
  farms: {
    url: `${HOST_URL}/farms`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1684326256/dopex_images/preview_images/farms_j9woij.png',
    alt: 'Farms',
    title: 'Dopex Yield Farms',
    description: 'Stake your LP tokens to earn rewards',
  },
  olp: {
    url: `${HOST_URL}/olp`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1684326254/dopex_images/preview_images/olp_umbar0.png',
    alt: 'OLP',
    title: 'OLP | Dopex Option Liquidity Pools',
    description:
      'Exit your SSOV positions mid-epoch or provide liquidity to purchase calls and puts at a discount',
  },
  scalps: {
    url: `${HOST_URL}/scalps`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1685374223/dopex_images/preview_images/scalps_k7mnxe.png',
    alt: 'Scalps',
    title: 'Dopex Option Scalps',
    description: 'Trade short time frames using high leverage at a fixed cost',
  },
  bonds: {
    url: `${HOST_URL}/dpx-bonds`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1684326253/dopex_images/preview_images/dpx-bonds_ihgulw.png',
    alt: 'Dopex Bonds',
    title: 'Dopex Bonds',
    description: 'Commit $USDC to receive $DPX at a discount',
  },
  vaults: {
    url: `${HOST_URL}/vaults`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1684326255/dopex_images/preview_images/default_qfq5rc.png',
    alt: 'Vaults',
    title: 'Vaults | Dopex',
    description: 'Buy/Sell vanilla options from the SSOVs',
  },
  default: {
    url: HOST_URL,
    title: 'Dopex',
    description:
      'Dopex is a maximum liquidity and minimal exposure options protocol',
    alt: 'Default',
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1684326255/dopex_images/preview_images/default_qfq5rc.png',
    width: 800,
    height: 450,
  },
};

export default seo;
