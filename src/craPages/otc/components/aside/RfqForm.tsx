import { useState, useEffect, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import noop from 'lodash/noop';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import Input from 'components/UI/Input';
import Accordion from 'components/UI/Accordion';
import Switch from 'components/UI/Switch';

import { AssetsContext } from 'contexts/Assets';
import { PortfolioContext } from 'contexts/Portfolio';
import { WalletContext } from 'contexts/Wallet';
import { SsovContext } from 'contexts/Ssov';

import Dropdown from 'assets/farming/Dropdown';
import InfoPopover from 'components/UI/InfoPopover';

const RfqForm = ({ selectedAsset }) => {
  const { userAssetBalances } = useContext(AssetsContext);
  // const { allOptions } = useContext(PortfolioContext);
  const { accountAddress } = useContext(WalletContext);
  const ssovContext = useContext(SsovContext);

  // const {
  //   selectedEpoch,
  //   ssovData: { epochTimes, epochStrikes },
  //   userSsovData: { epochStrikeTokens },
  //   tokenPrice,
  // } = ssovContext[selectedAsset.toLocaleLowerCase()];

  // console.log(epochStrikeTokens);

  const formik = useFormik({
    initialValues: {
      token: 'WETH',
      isPut: false,
      isBuy: false,
      amount: 0,
      strike: 0,
      dealer: accountAddress,
      timestamp: new Date().getSeconds(),
    },
    validate: (data) => {
      let errorMsg = '';
      errorMsg =
        data.amount === 0 || data.strike === 0 || data.dealer === ''
          ? 'Missing Field(s)'
          : '';
    },
    onSubmit: noop,
  });

  const handleTokenSelection = useCallback(
    (e) => {
      formik.setFieldValue('token', e.target.value);
    },
    [formik]
  );

  const handleChange = useCallback(
    (e) => {
      formik.setFieldValue('amount', Number(e.target.value));
    },
    [formik]
  );

  // const handleChangeStrike = useCallback(
  //   (e) => {
  //     formik.setFieldValue('strike', e.target.value);
  //   },
  //   [formik]
  // );

  const handleBuyOrder = useCallback(
    (e) => {
      formik.setFieldValue('isBuy', e.target.checked);
    },
    [formik]
  );

  return (
    <Box className="bg-cod-gray rounded-lg p-2">
      <Box className="flex flex-col space-y-2">
        <Box className="flex rounded-2xl">
          <CustomButton
            size="medium"
            className="w-full mr-2"
            color={formik.values.isPut ? 'umbra' : 'primary'}
            onClick={() => formik.setFieldValue('isPut', false)}
          >
            CALL
          </CustomButton>
          <CustomButton
            size="medium"
            className="w-full"
            color={formik.values.isPut ? 'down-bad' : 'umbra'}
            onClick={() => formik.setFieldValue('isPut', true)}
          >
            PUT
          </CustomButton>
        </Box>
        <Typography variant="h6" className="text-stieglitz">
          Quantity
        </Typography>
        <Input
          className="font-mono py-2 px-2"
          value={formik.values.amount}
          // defaultValue={formik.values.amount}
          onChange={handleChange}
          type="number"
          leftElement={
            <Select
              id="token"
              name="token"
              value={formik.values.token}
              onChange={handleTokenSelection}
              className="w-2/3 h-12 bg-cod-gray rounded-lg p-2"
              IconComponent={Dropdown}
              variant="outlined"
              classes={{ icon: 'mt-3 mr-1', root: 'p-0' }}
              MenuProps={{
                classes: { paper: 'bg-cod-gray' },
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                getContentAnchorEl: null,
              }}
            >
              <MenuItem value="WETH">
                <Box className="flex flex-row items-center">
                  <Box className="flex flex-row h-8 w-8 mr-2">
                    <img src={'/assets/eth.svg'} alt="WETH" />
                  </Box>
                  <Typography
                    variant="h5"
                    className="text-white hover:text-stieglitz"
                  >
                    ETH-2000-CALL-NOV30
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="DPX">
                <Box className="flex flex-row items-center">
                  <Box className="flex flex-row h-8 w-8 mr-2">
                    <img src={'/assets/dpx.svg'} alt="DPX" />
                  </Box>
                  <Typography
                    variant="h5"
                    className="text-white hover:text-stieglitz"
                  >
                    DPX-1500-CALL-NOV30
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="rDPX">
                <Box className="flex flex-row items-center">
                  <Box className="flex flex-row h-8 w-8 mr-2">
                    <img src={'/assets/rdpx.svg'} alt="rDPX" />
                  </Box>
                  <Typography
                    variant="h5"
                    className="text-white hover:text-stieglitz"
                  >
                    RDPX-66-CALL-DEC4
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
          }
        />
        <Select
          id="token"
          name="token"
          value={formik.values.token}
          onChange={handleTokenSelection}
          className="flex bg-umbra rounded-lg p-2"
          IconComponent={Dropdown}
          variant="outlined"
          classes={{ icon: 'mt-3 mr-1', root: 'p-0' }}
          MenuProps={{
            classes: { paper: 'bg-cod-gray' },
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            getContentAnchorEl: null,
          }}
        >
          <MenuItem value="WETH">
            <Box className="flex flex-row items-center">
              <Box className="flex flex-row h-8 w-8 mr-2">
                <img src={'/assets/eth.svg'} alt="WETH" />
              </Box>
              <Typography
                variant="h6"
                className="text-white hover:text-stieglitz"
              >
                ETH-2000-CALL-NOV30
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem value="DPX">
            <Box className="flex flex-row items-center">
              <Box className="flex flex-row h-8 w-8 mr-2">
                <img src={'/assets/dpx.svg'} alt="DPX" />
              </Box>
              <Typography
                variant="h6"
                className="text-white hover:text-stieglitz"
              >
                DPX
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem value="rDPX">
            <Box className="flex flex-row items-center">
              <Box className="flex flex-row h-8 w-8 mr-2">
                <img src={'/assets/rdpx.svg'} alt="rDPX" />
              </Box>
              <Typography
                variant="h6"
                className="text-white hover:text-stieglitz"
              >
                rDPX
              </Typography>
            </Box>
          </MenuItem>
        </Select>
        <Box className="flex justify-between px-2">
          <Box className="flex space-x-2">
            <Typography variant="h6" className="text-stieglitz my-auto">
              Buy Order
            </Typography>
            <InfoPopover
              infoText="Toggle between buy and sell order"
              className=""
              id="rfq-buy-toggle"
            />
          </Box>
          <Switch className="my-auto" onClick={handleBuyOrder} />
        </Box>
        <Box>
          <Accordion
            summary="What are RFQs?"
            details="Dealers can place requests-for-quote for options that they own and would like to sell. Interested buyers may bid on ongoing RFQs."
            footer={<Link to="/portfolio">Read More</Link>}
          />
        </Box>
        <CustomButton size="medium" className="flex w-full">
          <Typography variant="h6">Submit RFQ</Typography>
        </CustomButton>
      </Box>
    </Box>
  );
};

export default RfqForm;
