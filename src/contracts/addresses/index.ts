export const addresses = {
  Atlantics: {
    perpetuals: {
      'ETH-USDC-PUTS-weekly': {
        vault: '0x32EEce76C2C2e8758584A83Ee2F522D4788feA0f',
        collateral: '0x367761085BF3C12e5DA2Df99AC6E1a824612b8fb',
        underlying: '0x1c85638e118b37167e9298c2268758e058DdfDA0',
        optionPricing: '0x46b142DD1E924FAb83eCc3c08e4D46E82f005e0E',
        priceOracle: '0x86A2EE8FAf9A840F7a2c64CA3d51209F9A02081D',
        volatilityOracle: '0xfbC22278A96299D91d41C453234d97b4F5Eb9B2d',
        strategy: '0xD42912755319665397FF090fBB63B1a31aE87Cee',
      },
      'ETH-CALLS-monthly': {
        vault: '0x01c1DeF3b91672704716159C9041Aeca392DdFfb',
        collateral: '0x1c85638e118b37167e9298c2268758e058DdfDA0', // Same as underlying
        underlying: '0x1c85638e118b37167e9298c2268758e058DdfDA0',
        optionPricing: '0x46b142DD1E924FAb83eCc3c08e4D46E82f005e0E',
        priceOracle: '0x86A2EE8FAf9A840F7a2c64CA3d51209F9A02081D',
        volatilityOracle: '0xfbC22278A96299D91d41C453234d97b4F5Eb9B2d',
        strategy: '0xD42912755319665397FF090fBB63B1a31aE87Cee',
      },
    },
    'insured-stables': {},
  },
};
