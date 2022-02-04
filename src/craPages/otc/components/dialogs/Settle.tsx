import { useState, useCallback, useContext, useEffect } from 'react';
import { BigNumber } from 'ethers';
import Box from '@material-ui/core/Box';
import Dialog from 'components/UI/Dialog';
import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import smartTrim from 'utils/general/smartTrim';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import { ERC20__factory, Escrow__factory } from '@dopex-io/sdk';

import { WalletContext } from 'contexts/Wallet';
import { OtcContext } from 'contexts/Otc';
import sendTx from 'utils/contracts/sendTx';

interface TradeProps {
  open: boolean;
  handleClose: () => void;
  data: {
    isBuy: boolean;
    dealerQuote: {
      address: string;
      symbol: string;
    };
    dealerBase: {
      address: string;
      symbol: string;
    };
    dealerReceiveAmount: BigNumber;
    dealerSendAmount: BigNumber;
    dealer: string;
  };
}

const Settle = ({ open, handleClose, data }: TradeProps) => {
  const { selectedEscrowData } = useContext(OtcContext);
  const { signer, provider, accountAddress } = useContext(WalletContext);
  const [approved, setApproved] = useState(false);

  const handleTrade = useCallback(async () => {
    const escrow = Escrow__factory.connect(
      selectedEscrowData.selectedEscrow,
      provider
    );
    console.log(
      data.dealerBase.address,
      data.dealerQuote.address,
      '0x37715194Ecde27C1B92591e2B77937C51BB92c72',
      getUserReadableAmount(
        data.isBuy ? data.dealerSendAmount : data.dealerReceiveAmount,
        18
      ).toString(),
      getUserReadableAmount(
        !data.isBuy ? data.dealerSendAmount : data.dealerReceiveAmount,
        18
      ).toString()
    );

    await sendTx(
      escrow
        .connect(signer)
        .settle(
          data.dealerBase.address,
          data.dealerQuote.address,
          '0x37715194Ecde27C1B92591e2B77937C51BB92c72',
          data.isBuy ? data.dealerReceiveAmount : data.dealerSendAmount,
          !data.isBuy ? data.dealerReceiveAmount : data.dealerSendAmount
        )
    );
  }, [signer, provider, data, selectedEscrowData]);

  const handleApprove = useCallback(async () => {
    const userQuote = ERC20__factory.connect(data.dealerBase.address, provider);
    await sendTx(
      userQuote
        .connect(signer)
        .approve(accountAddress, data.dealerReceiveAmount)
    ).then(() => {
      setApproved(true);
    });
  }, [data, provider, signer, accountAddress]);

  useEffect(() => {
    (async () => {
      const userQuote = ERC20__factory.connect(
        data.dealerBase.address,
        provider
      );
      const allowance = await userQuote.allowance(
        accountAddress,
        selectedEscrowData.selectedEscrow
      );
      setApproved(allowance.gte(data.dealerReceiveAmount));
    })();
  }, [approved, data, provider, accountAddress, selectedEscrowData]);

  return (
    <Dialog open={open} handleClose={handleClose} showCloseIcon>
      <Box className="flex flex-col space-y-4">
        <Box className="space-y-4">
          <>
            <Box className="flex flex-col space-y-3">
              <Typography variant="h5" className="text-stieglitz">
                Settle
              </Typography>
              <Box className="flex flex-col space-y-2 bg-umbra p-3 rounded-xl">
                <Box className="flex justify-between space-x-2 my-auto">
                  <Typography variant="h6" className="text-stieglitz">
                    Base
                  </Typography>
                  <Typography variant="h6">{data.dealerBase.symbol}</Typography>
                </Box>
                <Box className="flex justify-between space-x-2 my-auto">
                  <Typography variant="h6" className="text-stieglitz">
                    Send Amount
                  </Typography>
                  <Typography variant="h6">
                    {getUserReadableAmount(data.dealerSendAmount, 18)}
                  </Typography>
                </Box>
                <Box className="flex justify-between space-x-2 my-auto">
                  <Typography variant="h6" className="text-stieglitz">
                    Ask
                  </Typography>
                  <Typography variant="h6">
                    {getUserReadableAmount(data.dealerReceiveAmount, 18)}
                  </Typography>
                </Box>
                <Box className="flex justify-between space-x-2 my-auto">
                  <Typography variant="h6" className="text-stieglitz">
                    Dealer Address
                  </Typography>
                  <Typography variant="h6">
                    {smartTrim(data.dealer, 10)}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box className="flex space-x-2">
              <CustomButton
                size="large"
                className="flex w-1/2"
                disabled={!approved}
                onClick={handleTrade}
              >
                Trade
              </CustomButton>
              <CustomButton
                size="large"
                className="flex w-1/2"
                disabled={approved}
                onClick={handleApprove}
              >
                Approve
              </CustomButton>
            </Box>
          </>
        </Box>
      </Box>
    </Dialog>
  );
};

export default Settle;
