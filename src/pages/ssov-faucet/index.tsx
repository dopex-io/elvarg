import { useContext, useState, useCallback, useMemo } from 'react';
import c from 'classnames';
import Box from '@material-ui/core/Box';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

import AppBar from 'components/AppBar';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';

import { WalletContext } from 'contexts/Wallet';

const SsovFaucet = () => {
  const { accountAddress } = useContext(WalletContext);

  const [response, setResponse] = useState({
    loading: false,
    statusCode: null,
    body: '',
  });

  const handleMint = useCallback(() => {
    setResponse((response) => ({
      ...response,
      loading: true,
    }));

    return axios
      .get(
        'https://8p6w777gtj.execute-api.us-east-2.amazonaws.com/default/ssovFaucet',
        {
          params: { userAddress: accountAddress },
        }
      )
      .then((result) => {
        setResponse({
          loading: false,
          statusCode: result.status,
          body: 'Success',
        });
      })
      .catch((err) => {
        setResponse({
          loading: false,
          statusCode: 400,
          body: err.response.data,
        });
      });
  }, [accountAddress]);

  const buttonContent = useMemo(() => {
    if (!accountAddress) {
      return 'Connect your wallet';
    } else if (response.loading) {
      return 'Your tokens are being minted';
    } else if (response.statusCode === 200) {
      return 'You can start using the minted tokens';
    } else if (response.statusCode === 400) {
      return response.body;
    } else {
      return 'Mint';
    }
  }, [response, accountAddress]);

  return (
    <Box className="bg-black min-h-screen">
      <AppBar active="faucet" />
      <Box className="py-64 lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-md mx-auto px-4 lg:px-0">
        <Box className=" bg-cod-gray rounded-xl mx-auto flex flex-col p-10 max-w-md">
          <Box className="flex flex-col mb-7">
            <Typography variant="h1" className="mb-3">
              SSOV Faucet
            </Typography>
            <Typography variant="h4" className="mb-6 text-wave-blue">
              Kovan
            </Typography>
            <Typography
              variant="h5"
              component="p"
              className="text-stieglitz p-3 border border-stieglitz rounded-lg border-opacity-50"
            >
              You can claim your DPX tokens below and use them to interact with
              the ssov on Kovan.
            </Typography>
          </Box>
          <Box className="flex flex-col">
            <CustomButton
              size="large"
              className="mx-auto"
              fullWidth
              onClick={handleMint}
              disabled={
                !accountAddress || response.loading || response.statusCode
              }
            >
              <span className="text-md text-white capitalize">
                {buttonContent}
              </span>
            </CustomButton>
          </Box>
          <Box
            className={c(
              response.loading
                ? 'mt-6 flex items-center justify-items-center justify-center text-4xl'
                : 'hidden'
            )}
          >
            <CircularProgress />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SsovFaucet;
