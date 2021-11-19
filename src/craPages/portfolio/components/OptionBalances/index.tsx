import { useContext, useState, useMemo, useCallback, useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { BigNumber, utils as ethersUtils } from 'ethers';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import OptionsData from './OptionsData';

import { PortfolioContext } from 'contexts/Portfolio';
import { AssetsContext } from 'contexts/Assets';
import { WalletContext } from 'contexts/Wallet';

import { BASE_ASSET_MAP } from 'constants/index';

const OptionsBalances = () => {
  const { allOptions, delegatedOptions, marginOptions } =
    useContext(PortfolioContext);
  const { baseAssetsWithPrices } = useContext(AssetsContext);
  const { accountAddress, connect } = useContext(WalletContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [expired] = useState(0);
  const [userOptions, setUserOptions] = useState([]);
  const [lowAmountOptionsCount, setLowAmountOptionsCount] = useState<number>();

  // const toggleChecked = useCallback(
  //   (event) => setChecked(event.target.checked),
  //   []
  // );

  const [userOptionsFilter, setUserOptionsFilter] = useState({
    showLowAmount: false,
  });

  const filteredAllOptions = useMemo(() => {
    return allOptions[Object.keys(allOptions)[selectedIndex]] ?? [];
  }, [selectedIndex, allOptions]);
  const filteredDelegatedOptions = useMemo(() => {
    return delegatedOptions[Object.keys(delegatedOptions)[selectedIndex]] ?? [];
  }, [selectedIndex, delegatedOptions]);
  const filteredMarginOptions = useMemo(() => {
    return marginOptions[Object.keys(marginOptions)[selectedIndex]] ?? [];
  }, [selectedIndex, marginOptions]);

  const filteredOptions = useMemo(() => {
    return filteredAllOptions
      .map((item) => ({ ...item, isDelegated: false, isMargin: false }))
      .concat(
        filteredDelegatedOptions.map((item) => ({
          ...item,
          isDelegated: true,
          isMargin: false,
        }))
      )
      .concat(
        filteredMarginOptions.map((item) => ({
          ...item,
          isDelegated: false,
          isMargin: true,
        }))
      );
  }, [filteredAllOptions, filteredDelegatedOptions, filteredMarginOptions]);

  const handleClickListItem = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClick = useCallback(() => {
    if (accountAddress === '') {
      connect();
    }
  }, [accountAddress, connect]);

  const handleMenuItemClick = useCallback(
    (_event: React.MouseEvent<HTMLElement>, index: number) => {
      setSelectedIndex(index);
      setAnchorEl(null);
    },
    []
  );

  const toggleShowLowAmountCheck = useCallback(
    (event) =>
      setUserOptionsFilter((prev) => ({
        ...prev,
        showLowAmount: event.target.checked,
      })),
    [setUserOptionsFilter]
  );

  useEffect(() => {
    if (!userOptionsFilter.showLowAmount) {
      const filtered = filteredOptions.filter((option) =>
        BigNumber.from(option.userBalance).gt(ethersUtils.parseEther('0.0001'))
      );

      setUserOptions(filtered);

      const lowAmountAssetOptions = filteredOptions.filter((option) =>
        BigNumber.from(option.userBalance).lt(ethersUtils.parseEther('0.0001'))
      );

      setLowAmountOptionsCount(lowAmountAssetOptions.length);
    } else {
      setUserOptions(filteredOptions);
    }
  }, [filteredOptions, userOptionsFilter.showLowAmount]);

  return (
    <section className="bg-cod-gray rounded-lg box-border my-2 md:ml-1.5 md:mb-1.5 md:mr-2">
      <Box className="h-100">
        <Typography variant="h6" className="text-xl p-3 text-stieglitz">
          Options
        </Typography>
        <Box className="flex mb-3 justify-between">
          <Box className="flex">
            <CustomButton
              variant="text"
              size="medium"
              className="pl-3 mx-4 bg-mineshaft text-white hover:bg-mineshaft hover:opacity-80 font-normal"
              onClick={handleClickListItem}
              disableRipple
            >
              {
                BASE_ASSET_MAP[Object.keys(allOptions)[selectedIndex] || 'WBTC']
                  .symbol
              }
              <KeyboardArrowDownRoundedIcon className="fill-white text-white" />
            </CustomButton>
            <Menu
              id="lock-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              variant="menu"
              classes={{ paper: 'bg-umbra text-white' }}
            >
              {Object.keys(allOptions).map((option, index) => (
                <MenuItem
                  key={index}
                  selected={index === selectedIndex}
                  onClick={(event) => handleMenuItemClick(event, index)}
                >
                  {BASE_ASSET_MAP[option].symbol}
                </MenuItem>
              ))}
            </Menu>
            {expired !== 0 ? (
              <Box className="flex border border-umbra rounded-md py-2 px-1">
                <InfoOutlinedIcon className="fill-current text-mineshaft w-5 h-5" />
                <span className="bg-cod-gray text-stieglitz text-xs font-light px-1 my-auto">
                  {expired} {' Recently Expired Positions'}
                </span>
              </Box>
            ) : null}
            {isEmpty(allOptions) ? (
              accountAddress ? (
                <CircularProgress className="p-2" />
              ) : (
                <CustomButton
                  variant="text"
                  size="medium"
                  className="text-white bg-primary hover:bg-primary"
                  onClick={handleClick}
                >
                  Connect Wallet
                </CustomButton>
              )
            ) : filteredOptions.length === 0 ? (
              <Box className="flex border border-umbra rounded-md py-2 px-1">
                <InfoOutlinedIcon className="fill-current text-mineshaft w-5 h-5" />
                <span className="bg-cod-gray text-stieglitz text-xs font-light px-1 my-auto">
                  No options to display
                </span>
              </Box>
            ) : null}
          </Box>
          <Box className="flex">
            <Box className="flex space-x-1 pr-3 pl-2 mx-4">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={userOptionsFilter.showLowAmount}
                    onChange={toggleShowLowAmountCheck}
                    color="default"
                    className="p-0 mr-2 text-white"
                  />
                }
                label={
                  <Typography variant="h6" className="text-white">
                    {`Show low amount (${lowAmountOptionsCount})`}
                  </Typography>
                }
              />

              {/* <Box className="flex space-x-1 pr-3 pl-2 mx-4">
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={toggleChecked}
                  color="primary"
                  className="p-0 mr-2 text-white"
                />
              }
              label={
                <Typography variant="h6" className="text-white">
                  Show Expired
                </Typography>
              }
            />
          </Box> */}
            </Box>
          </Box>
        </Box>
        {baseAssetsWithPrices
          ? Object.keys(baseAssetsWithPrices).map((asset, index) => {
              return asset === Object.keys(allOptions)[selectedIndex] ? (
                <OptionsData
                  key={index}
                  selectedIndex={selectedIndex}
                  price={baseAssetsWithPrices[asset].price}
                  asset={asset}
                  fullName={baseAssetsWithPrices[asset].fullName}
                  assetOptions={userOptions}
                />
              ) : null;
            })
          : null}
      </Box>
    </section>
  );
};

export default OptionsBalances;
