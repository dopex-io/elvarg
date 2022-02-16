import { useContext, useEffect, useState } from 'react';
import { getMessageFromCode } from 'eth-rpc-errors';
import { BigNumber } from 'ethers';
import { ERC20__factory } from '@dopex-io/sdk';
import format from 'date-fns/format';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

import Typography from 'components/UI/Typography';

import getContractReadableAmount from 'utils/contracts/getContractReadableAmount';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

import useSendTx from 'hooks/useSendTx';

import { WalletContext } from 'contexts/Wallet';
import { PortfolioContext } from 'contexts/Portfolio';

import { BASE_ASSET_MAP, STAT_NAMES } from 'constants/index';

import { DialogProps } from '.';

const Transfer = ({ closeModal, data, icon }: DialogProps) => {
  const [state, setState] = useState({ recipientAddress: '', amount: '' });
  const [error, setError] = useState('');
  const { accountAddress, signer } = useContext(WalletContext);
  const { updateOptionBalances } = useContext(PortfolioContext);
  const { optionsContract } = data;
  const [modalData, setModalData] = useState({
    strike: '',
    expiry: '',
    amount: '',
  });

  const sendTx = useSendTx();

  useEffect(() => {
    setModalData({
      strike: '$' + getUserReadableAmount(data.strike, 8).toString(),
      expiry: format(
        new Date(Number(data.expiry) * 1000),
        'd LLL yyyy'
      ).toLocaleUpperCase(),
      amount: getUserReadableAmount(data.userBalance, 18).toString(),
    });
  }, [data]);

  const handleClick = async () => {
    if (!state.recipientAddress) {
      setError('No recipient address entered');
      return;
    } else if (!state.amount) {
      setError('No amount entered');
      return;
    } else if (Number(state.amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    try {
      const { recipientAddress, amount } = state;
      const fAmount = getContractReadableAmount(amount, 18);
      let currentBalance = await optionsContract.balanceOf(accountAddress);
      if (fAmount.gt(BigNumber.from(currentBalance))) {
        setError('Insufficient Balance');
        return;
      }
      await sendTx(
        ERC20__factory.connect(optionsContract.address, signer).transfer(
          recipientAddress,
          fAmount
        )
      );
      closeModal();
      updateOptionBalances();
    } catch (err) {
      console.error(err);
      setError(`Something went wrong. Error: ${getMessageFromCode(err.code)}`);
    }
  };

  const handleChange = (e) => {
    const newState = { ...state };
    newState[e.target.name] = e.target.value;
    setError('');
    setState(newState);
  };

  return (
    <Box className="flex flex-col">
      <Typography variant="h5" className="mb-3">
        Transfer
      </Typography>
      <Box className="flex flex-col bg-umbra rounded-lg p-4 mb-4">
        <Box className="flex mb-4">
          <img
            src={`${icon}`}
            alt={BASE_ASSET_MAP[data.asset].symbol}
            className="w-8 h-8 my-auto"
          />
          <span className="my-auto px-2 text-white">
            {BASE_ASSET_MAP[data.asset].symbol}
          </span>
          <span className="text-xs text-white bg-mineshaft rounded-md my-auto ml-2 p-2">
            {data.isPut ? 'PUT' : 'CALL'}
          </span>
        </Box>
        <Box className="rounded-lg flex flex-col text-white">
          <Box className="flex flex-col space-y-4">
            {Object.keys(modalData).map((key) => {
              return (
                <Box key={key} className="flex justify-between">
                  <Typography
                    variant="caption"
                    component="div"
                    className="text-stieglitz"
                  >
                    {STAT_NAMES.transfer[key]}
                  </Typography>
                  <Typography variant="caption" component="div">
                    {modalData[key]}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
      <Box className="flex">
        <Box className="bg-umbra flex flex-row p-4 rounded-xl justify-between mb-1 mr-2  w-1/4">
          <Input
            disableUnderline={true}
            id="amount"
            name="amount"
            onChange={handleChange}
            type="number"
            className="h-8 text-sm text-white font-mono"
            placeholder="Amount"
          />
        </Box>
        <Box className="bg-umbra flex flex-row p-4 rounded-xl justify-between mb-1 w-3/4">
          <Input
            disableUnderline={true}
            id="address"
            name="recipientAddress"
            onChange={handleChange}
            type="text"
            className="h-8 text-sm text-white font-mono"
            placeholder="Recipient Address"
            fullWidth
          />
        </Box>
      </Box>

      <Typography variant="h6" className="px-3 mb-3">
        {error}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        className="w-full p-5 bottom-0 rounded-md"
      >
        Transfer
      </Button>
    </Box>
  );
};

export default Transfer;
