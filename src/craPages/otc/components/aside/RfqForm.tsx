import { useState, useEffect, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import noop from 'lodash/noop';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { ERC20__factory } from '@dopex-io/sdk';
import { addDoc, collection } from '@firebase/firestore';
import * as yup from 'yup';

import CustomButton from 'components/UI/CustomButton';
import Typography from 'components/UI/Typography';
import Input from 'components/UI/Input';
import Accordion from 'components/UI/Accordion';
import Switch from 'components/UI/Switch';

import { AssetsContext } from 'contexts/Assets';
import { WalletContext } from 'contexts/Wallet';
import { UserSsovData } from 'contexts/Ssov';

import Dropdown from 'assets/farming/Dropdown';
import InfoPopover from 'components/UI/InfoPopover';

import { db } from 'utils/firebase/initialize';

interface RfqFormProps {
  symbol: string;
  icon: string;
  ssovUserData: UserSsovData;
}

const RfqForm = ({ symbol, icon, ssovUserData }: RfqFormProps) => {
  const { userAssetBalances } = useContext(AssetsContext);
  const { accountAddress, provider } = useContext(WalletContext);

  const [userOptionBalances, setUserOptionBalances] = useState([]);
  const [processing, setProcessing] = useState(false);

  const validationSchema = yup.object({
    amount: yup
      .number()
      .min(0, 'Amount has to be greater than 0')
      .required('Amount is required'),
  });

  const formik = useFormik({
    initialValues: {
      optionSymbol: '-',
      isPut: false,
      isBuy: false,
      amount: 0,
      strike: 0,
      timestamp: new Date(),
    },
    validationSchema: validationSchema,
    onSubmit: noop,
  });

  const handleTokenSelection = useCallback(
    (e) => {
      formik.setFieldValue('optionSymbol', e.target.value);
    },
    [formik]
  );

  const handleChange = useCallback(
    (e) => {
      formik.setFieldValue('amount', Number(e.target.value));
    },
    [formik]
  );

  const handleBuyOrder = useCallback(
    (e) => {
      formik.setFieldValue('isBuy', e.target.checked);
    },
    [formik]
  );

  const handleSubmit = useCallback(async () => {
    setProcessing(true);
    await addDoc(collection(db, 'orders'), {
      optionSymbol: formik.values.optionSymbol,
      isBuy: formik.values.isBuy,
      isPut: formik.values.isPut,
      amount: formik.values.amount,
      dealer: accountAddress,
      timestamp: formik.values.timestamp,
    }).finally(() => {
      setProcessing(false);
    });
  }, [formik, accountAddress]);

  const ssovUserDataToAssetMapping = useCallback(async () => {
    const data = ssovUserData.epochStrikeTokens.map(async (token, index) => {
      const erc20Token = ERC20__factory.connect(token.address, provider);
      const tokenSymbol = await erc20Token.symbol();
      const tokenAddress = await erc20Token.address;

      return {
        token: tokenSymbol,
        tokenAddress,
        purchaseAmount: ssovUserData.userEpochCallsPurchased[index],
      };
    });
    Promise.all(data).then((result) => {
      setUserOptionBalances(result);
    });
  }, [ssovUserData, provider]);

  useEffect(() => {
    ssovUserDataToAssetMapping();
  }, [ssovUserDataToAssetMapping]);

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
          className="py-2 px-2"
          value={formik.values.amount}
          onChange={handleChange}
          type="number"
          leftElement={
            <Box
              id="token"
              className="bg-cod-gray p-2 rounded-xl space-x-2 flex w-full"
            >
              <img src={icon} alt="token" />
              <Typography variant="h5" className="text-white my-auto">
                {symbol}
              </Typography>
            </Box>
          }
        />
        <Select
          id="token"
          name="token"
          value={formik.values.optionSymbol}
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
          {userOptionBalances.map((option, index) => {
            return (
              <MenuItem value={option.token} key={index}>
                <Box className="flex flex-row items-center">
                  <Typography variant="h6" className="text-white ">
                    {option.token}
                  </Typography>
                </Box>
              </MenuItem>
            );
          })}
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
        <CustomButton
          size="medium"
          className="flex w-full"
          onClick={handleSubmit}
        >
          <Typography variant="h6">
            {processing ? 'Processing' : 'Submit RFQ'}
          </Typography>
        </CustomButton>
      </Box>
    </Box>
  );
};

export default RfqForm;
