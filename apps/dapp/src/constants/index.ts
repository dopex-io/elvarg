export const DECIMALS_TOKEN: number = 18;
export const DECIMALS_STRIKE: number = 8;
export const DECIMALS_USD: number = 6;

export const ZERO_ADDRESS: string =
  '0x0000000000000000000000000000000000000000';

export const OPTION_TOKEN_DECIMALS = 18;

export const CURRENCIES_MAP: { [key: string]: string } = {
  '1': 'ETH',
  '5': 'ETH',
  '42161': 'ETH',
  '56': 'BNB',
  '137': 'MATIC',
  '43114': 'AVAX',
  '1088': 'METIS',
};

export const MAX_VALUE: string =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';

export const S3_BUCKET_RESOURCES = {
  DPX: 'https://dopex-general.s3.us-east-2.amazonaws.com/image/tokens/DPX.png',
  RDPX: 'https://dopex-general.s3.us-east-2.amazonaws.com/image/tokens/rDPX.png',
};

export const DISCLAIMER_MESSAGE = {
  english:
    'I am not the person or entities who reside in, are citizens of, are incorporated in, or have a registered office in the United States of America and OFAC restricted localities.\nI will not in the future access this site or use Dopex dApp while located within the United States and OFAC restricted localities.\nI am not using, and will not in the future use, a VPN to mask my physical location from a restricted territory.\nI am lawfully permitted to access this site and use Dopex dApp under the laws of the jurisdiction on which I reside and am located.\nI understand the risks associated with using products by Dopex.',
};

export const CLAMM_DISCLAIMER_MESSAGE = {
  english:
    'This is an MVP, and we encourage you to explore its features. If you encounter any issues or bugs, please report them on our Discord channel.\n' +
    "Regarding purchased options, it's important to note that they must be exercised before the expiry deadline. Failure to do so will result in the inability to exercise those options altogether. Please keep in mind that this limitation is specific to the MVP.\n" +
    "When it comes to deposits, please be aware that the strike prices are subject to change based on the asset's price fluctuations. This means that a strike price you see at a certain point may not be available at a later time, depending on how the asset's price evolves.\n" +
    "If you have written options that are currently active as collateral for other options, you can only withdraw the portion of your liquidity provider (LP) tokens that hasn't been utilized. The remaining LP tokens can be withdrawn once the options have been exercised",
};

export const OFAC_COMPLIANCE_LOCAL_STORAGE_KEY =
  'DOPEX_OFAC_COMPLIANCE_SIGNATURE';
