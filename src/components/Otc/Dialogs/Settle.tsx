import { useState, useCallback, useContext, useEffect } from 'react';
import { BigNumber } from 'ethers';
import Box from '@mui/material/Box';
import { ERC20__factory } from '@dopex-io/sdk';

import Typography from 'components/UI/Typography';
import CustomButton from 'components/UI/CustomButton';
import Dialog from 'components/UI/Dialog';
import DialogDataRow from 'components/Otc/DialogDataRow';

import { WalletContext } from 'contexts/Wallet';
import { OtcContext } from 'contexts/Otc';

import useSendTx from 'hooks/useSendTx';

import smartTrim from 'utils/general/smartTrim';
import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';

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
    counterParty: string;
  };
}

const Settle = ({ open, handleClose, data }: TradeProps) => {
  const sendTx = useSendTx();

  const { escrow } = useContext(OtcContext);
  const { signer, provider, accountAddress } = useContext(WalletContext);
  const [approved, setApproved] = useState(false);
  const [decimals, setDecimals] = useState({
    quote: 18,
    base: 18,
  });

  const handleTrade = useCallback(async () => {
    await sendTx(
      escrow
        .connect(signer)
        .fulfill(data.dealerQuote.address, data.dealerBase.address, data.dealer)
    );
  }, [signer, data, escrow, sendTx]);

  const handleApprove = useCallback(async () => {
    const userQuote = ERC20__factory.connect(data.dealerBase.address, provider);
    await sendTx(
      userQuote
        .connect(signer)
        .approve(escrow.address, data.dealerReceiveAmount)
    ).then(() => {
      setApproved(true);
    });
  }, [data, provider, signer, escrow, sendTx]);

  useEffect(() => {
    (async () => {
      if (!data) return;

      const userQuote = ERC20__factory.connect(
        data.dealerBase.address,
        provider
      );
      const quoteDecimals = await userQuote.decimals();
      const userBase = ERC20__factory.connect(
        data.dealerQuote.address,
        provider
      );
      const baseDecimals = await userBase.decimals();

      const allowance = await userQuote.allowance(
        accountAddress,
        escrow.address
      );
      setApproved(allowance.gte(data.dealerReceiveAmount));
      setDecimals({ quote: quoteDecimals, base: baseDecimals });
    })();
  }, [approved, data, provider, accountAddress, escrow]);

  return (
    data && (
      <Dialog open={open} handleClose={handleClose} showCloseIcon>
        <Box className="flex flex-col space-y-4">
          <Box className="space-y-4">
            <>
              <Box className="flex flex-col space-y-3">
                <Typography variant="h5" className="text-stieglitz">
                  Settle
                </Typography>
                <Box className="flex flex-col space-y-2 my-2 bg-umbra border border-mineshaft rounded-2xl p-3">
                  <DialogDataRow
                    info={`Dealer's base`}
                    value={data.dealerBase.symbol}
                  />
                  <DialogDataRow
                    info="Receive"
                    value={`${getUserReadableAmount(
                      data.dealerSendAmount,
                      decimals.base
                    )} ${data.dealerQuote.symbol}`}
                  />
                  <DialogDataRow
                    info="Send"
                    value={`${getUserReadableAmount(
                      data.dealerReceiveAmount,
                      decimals.quote
                    )} ${data.dealerBase.symbol}`}
                  />
                  <DialogDataRow
                    info={`Dealer's Address`}
                    value={smartTrim(data.dealer, 10)}
                  />
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
    )
  );
};

export default Settle;
