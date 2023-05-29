import { HOST_URL } from 'constants/env';

const seo = {
  ssov: {
    url: `${HOST_URL}/ssov`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1684326255/dopex_images/preview_images/ssov_rbhar7.png',
    alt: 'SSOV',
    title: 'SSOV | Dopex Single Staking Options Vault',
    description: 'Sell covered options to earn yield',
  },
  straddles: {
    url: `${HOST_URL}/straddles`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1684326260/dopex_images/preview_images/straddles_zpcdyo.png',
    alt: 'Straddles',
    title: 'Dopex Atlantic Straddles',
    description: 'Buy/Write straddles on crypto assets',
  },
  vedpx: {
    url: `${HOST_URL}/governance/vedpx`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1685374223/dopex_images/preview_images/vedpx_ou2nyt.png',
    alt: 'veDPX',
    title: 'veDPX | Escrowed DPX',
    description: 'Earn yield, protocol fees, and vote in the protocol',
  },
  zdte: {
    url: `${HOST_URL}/ztde/`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1684326258/dopex_images/preview_images/zdte_vano5r.png',
    alt: '0DTE',
    title: '0dte | Dopex Zero Day-to-Expiry options',
    description: 'Options that expire on day of purchase',
  },
  insuredPerpsLP: {
    url: `${HOST_URL}/atlantics`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1684326257/dopex_images/preview_images/insured-perps-lp_raxiiq.png',
    alt: 'Insured Perps',
    title: 'Dopex Atlantic Insured Perps LP',
    description: 'Write weekly atlantic puts to earn premium + funding',
  },
  insuredPerps: {
    url: `${HOST_URL}/atlantics`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1685374223/dopex_images/preview_images/insured-perps_ak7l2z.png',
    alt: 'Insured Perps',
    title: 'Dopex Atlantic Insured Perps',
    description: 'Open liquidation-free longs',
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
    description: 'Dopex Time-Weighted Average Price Swap',
  },
  farms: {
    url: `${HOST_URL}/farms`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1684326256/dopex_images/preview_images/farms_j9woij.png',
    alt: 'Farms',
    title: 'Dopex Yield Farms',
    description: 'Earn rewards for liquidity staking',
  },
  olp: {
    url: `${HOST_URL}/olp`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1684326254/dopex_images/preview_images/olp_umbar0.png',
    alt: 'OLP',
    title: 'OLP | Dopex Option Liquidity Pools',
    description: 'Liquidity Pool for SSOV options',
  },
  scalps: {
    url: `${HOST_URL}/scalps`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1685374223/dopex_images/preview_images/scalps_k7mnxe.png',
    alt: 'Scalps',
    title: 'Dopex Option Scalps',
    description: 'Scalp trading with small time frame options',
  },
  bonds: {
    url: `${HOST_URL}/dpx-bonds`,
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1684326253/dopex_images/preview_images/dpx-bonds_ihgulw.png',
    alt: 'Dopex Bonds',
    title: 'Dopex Bonds',
    description: 'Commit stables to received DPX at a discount',
  },
  default: {
    url: HOST_URL,
    title: 'Dopex',
    description:
      'Dopex is a maximum liquidity and minimal exposure options protocol',
    alt: 'Default',
    banner:
      'https://res.cloudinary.com/dxitdndu3/image/upload/v1684326255/dopex_images/preview_images/default_qfq5rc.png',
  },
};

export default seo;
