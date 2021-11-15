import { useContext, useMemo } from 'react';
import { useFormik } from 'formik';
import noop from 'lodash/noop';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { AssetSwapper__factory, ERC20__factory } from '@dopex-io/sdk';
import BigNumber from 'bignumber.js';

import { WalletContext } from 'contexts/Wallet';
import { AssetsContext } from 'contexts/Assets';

import sendTx from 'utils/contracts/sendTx';

import AppBar from 'components/AppBar';
import Typography from 'components/UI/Typography';
import Input from 'components/UI/Input';
import CustomButton from 'components/UI/CustomButton';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import formatAmount from 'utils/general/formatAmount';

BigNumber.config({ EXPONENTIAL_AT: 1e9 });

const SWAP_ASSETS = [
  {
    name: 'USDT',
    icon: '/assets/usdt.svg',
    priceKey: 'priceUsd',
  },
  {
    name: 'WETH',
    icon: '/assets/weth.svg',
    priceKey: 'priceEth',
  },
  {
    name: 'WBTC',
    icon: '/assets/wbtc.svg',
    priceKey: 'priceBtc',
  },
];

const SWAP_ASSETS_PRICE_KEYS = {
  USDT: 'priceUsd',
  WETH: 'priceEth',
  WBTC: 'priceBtc',
};

const SWAP_ASSETS_DECIMALS = {
  USDT: 6,
  WETH: 18,
  WBTC: 18,
};

export default function Swap() {
  const { contractAddresses, signer } = useContext(WalletContext);
  const { userAssetBalances, baseAssetsWithPrices } = useContext(AssetsContext);

  const formik = useFormik({
    initialValues: {
      from: 'USDT',
      to: 'WETH',
      amount: 0,
    },
    enableReinitialize: true,
    onSubmit: noop,
  });

  const handleMaxInput = () => {
    const selectedAsset = formik.values.from;
    formik.setFieldValue(
      'amount',
      new BigNumber(userAssetBalances[selectedAsset]).dividedBy(
        `1e${SWAP_ASSETS_DECIMALS[selectedAsset]}`
      )
    );
  };

  const onFromChange = (e) => {
    formik.setFieldValue('from', e.target.value);
  };

  const onToChange = (e) => {
    formik.setFieldValue('to', e.target.value);
  };

  const handleSwap = async () => {
    const assetSwapper = AssetSwapper__factory.connect(
      contractAddresses.AssetSwapper,
      signer
    );

    const token = ERC20__factory.connect(
      contractAddresses[formik.values.from],
      signer
    );

    const fAmount = new BigNumber(formik.values.amount)
      .times(`1e${await token.decimals()}`)
      .toString();

    await sendTx(token.approve(contractAddresses.AssetSwapper, fAmount));

    await sendTx(
      assetSwapper.swapAsset(
        contractAddresses[formik.values.from],
        contractAddresses[formik.values.to],
        fAmount
      )
    );
  };

  const amountOut = useMemo(() => {
    if (!baseAssetsWithPrices) return 0;
    if (formik.values.from === 'USDT') {
      return (
        formik.values.amount / baseAssetsWithPrices[formik.values.to]?.priceUsd
      );
    } else if (formik.values.to === 'USDT') {
      return (
        formik.values.amount *
        baseAssetsWithPrices[formik.values.from]?.priceUsd
      );
    } else {
      return (
        formik.values.amount /
        baseAssetsWithPrices[formik.values.to][
          SWAP_ASSETS_PRICE_KEYS[formik.values.from]
        ]
      );
    }
  }, [baseAssetsWithPrices, formik]);

  return (
    <Box className="bg-black min-h-screen">
      <AppBar active="swap" />
      <Box className="pt-48 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <Box className=" bg-cod-gray rounded-xl mx-auto flex flex-col p-8 max-w-md">
          <Box className="flex flex-col">
            <Box className="flex flex-row items-center content-center w-full">
              <Box className="flex flex-col flex-1 ">
                <Typography variant="h2" className="mb-5">
                  Swap
                </Typography>
                <Typography
                  variant="caption"
                  component="div"
                  className="text-stieglitz mb-2"
                >
                  Balance:{' '}
                  {formatAmount(
                    getUserReadableAmount(
                      userAssetBalances[formik.values.from],
                      SWAP_ASSETS_DECIMALS[formik.values.from]
                    )
                  )}
                </Typography>
              </Box>
              {/* sets input to current balance of the user */}
              <Typography
                variant="h6"
                component="div"
                className="text-wave-blue pr-3 my-auto"
                role="button"
                onClick={handleMaxInput}
              >
                MAX
              </Typography>
            </Box>
            <Box className="mb-4">
              <Input
                leftElement={
                  <Select
                    id="token"
                    name="token"
                    value={formik.values.from}
                    onChange={onFromChange}
                    className="bg-cod-gray rounded-xl p-2"
                    variant="outlined"
                    classes={{ root: 'p-0', icon: 'text-white' }}
                    MenuProps={{ classes: { paper: 'bg-cod-gray' } }}
                  >
                    {SWAP_ASSETS.map((a) => {
                      return (
                        <MenuItem
                          value={a.name}
                          key={a.name}
                          disabled={formik.values.to === a.name}
                        >
                          <Box className="flex flex-row items-center">
                            <Box className="flex flex-row h-8 w-8 mr-2">
                              <img src={a.icon} alt={a.name} />
                            </Box>
                            <Typography
                              variant="h5"
                              className="text-white hover:text-stieglitz"
                            >
                              {a.name}
                            </Typography>
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </Select>
                }
                id="amount"
                name="amount"
                type="number"
                placeholder="0"
                value={formik.values.amount.toString()}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
              />
            </Box>
            <Input
              style={{
                color: 'white',
              }}
              leftElement={
                <Select
                  id="token"
                  name="token"
                  className="bg-cod-gray rounded-xl p-2"
                  variant="outlined"
                  value={formik.values.to}
                  onChange={onToChange}
                  classes={{ root: 'p-0', icon: 'text-white' }}
                  MenuProps={{ classes: { paper: 'bg-cod-gray' } }}
                >
                  {SWAP_ASSETS.map((a) => {
                    return (
                      <MenuItem
                        value={a.name}
                        key={a.name}
                        disabled={formik.values.from === a.name}
                      >
                        <Box className="flex flex-row items-center">
                          <Box className="flex flex-row h-8 w-8 mr-2">
                            <img src={a.icon} alt={a.name} />
                          </Box>
                          <Typography
                            variant="h5"
                            className="text-white hover:text-stieglitz"
                          >
                            {a.name}
                          </Typography>
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              }
              id="amount"
              name="amount"
              type="number"
              placeholder="0"
              disabled
              value={amountOut.toString()}
            />
            <CustomButton onClick={handleSwap} size="large" className="mt-4">
              Swap
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
