import { useCallback, useMemo } from 'react';
import Link from 'next/link';

import { Button } from '@dopex-io/ui';
import cx from 'classnames';
import useSendTx from 'hooks/useSendTx';
import Countdown from 'react-countdown';
import { useBoundStore } from 'store';

import getUserReadableAmount from 'utils/contracts/getUserReadableAmount';
import displayAddress from 'utils/general/displayAddress';
import formatAmount from 'utils/general/formatAmount';

const OrdersTable = () => {
  const {
    signer,
    optionScalpUserData,
    optionScalpData,
    updateOptionScalpUserData,
    getScalpOrders,
  } = useBoundStore();

  const sendTx = useSendTx();

  const orders = useMemo(() => {
    return optionScalpUserData?.scalpOrders;
  }, [optionScalpUserData]);

  const tableHeadings = [
    'Positions',
    'Type',
    'Price',
    'Collateral',
    'Expiry',
    'View on Etherscan',
  ];

  const ordersKeys = [
    'positions',
    'isOpen',
    'price',
    'collateral',
    'expiry',
    'transactionHash',
  ];

  const getCellComponent = useCallback(
    (key: string, order: any) => {
      if (!optionScalpData) return null;
      // if (key === 'positions');
      let rightContent: string | null = null;
      let styles = '';
      let data = order[key];
      let dataStyle = '';
      let rightContentStyle = '';

      if (key === 'isOpen') {
        data = data ? 'Open' : 'Close';
        dataStyle += data === 'Close' ? 'text-[#FF617D]' : 'text-[#6DFFB9]';
      }

      if (key === 'positions') {
        rightContent = optionScalpData?.baseSymbol ?? '';
        dataStyle += (optionScalpData.inverted ? !order.isShort : order.isShort)
          ? 'text-[#FF617D]'
          : 'text-[#6DFFB9]';

        rightContentStyle = dataStyle + ' text-xs hidden md:inline-block';
        data = (optionScalpData?.inverted ? !order.isShort : order.isShort)
          ? '-' +
            getUserReadableAmount(
              data,
              optionScalpData?.quoteDecimals.toNumber()
            )
          : '+' +
            getUserReadableAmount(
              data,
              optionScalpData?.quoteDecimals.toNumber()
            );
      }

      if (key === 'size' || key === 'price') {
        data = formatAmount(
          getUserReadableAmount(
            order[key],
            optionScalpData?.quoteDecimals.toNumber()
          ),
          4
        );
      }

      if (key === 'collateral') {
        data =
          formatAmount(
            getUserReadableAmount(
              order[key],
              optionScalpData?.quoteDecimals.toNumber()
            ),
            4
          ) +
          ' ' +
          optionScalpData.quoteSymbol;
      }

      if (key === 'expiry') {
        data = (
          <Countdown
            date={order.expiry * 1000}
            renderer={({ hours, minutes, seconds }) => {
              return (
                <span className="text-xs md:text-sm text-white pt-1">
                  {hours}h {minutes}m {seconds}s
                </span>
              );
            }}
          />
        );
      }

      if (key === 'transactionHash') {
        data = (
          <Link target="_blank" href={'https://arbiscan.io/tx/' + data}>
            {displayAddress(data)}
          </Link>
        );
      }

      return (
        <span
          className={cx(
            styles,
            'text-xs md:text-sm text-left w-full text-white space-x-2 md:space-x-1'
          )}
        >
          <span className={dataStyle}>{data}</span>
          <span className={rightContentStyle}>{rightContent}</span>
        </span>
      );
    },
    [optionScalpData]
  );

  const handleCancel = useCallback(
    async (type: string, id: number) => {
      if (!optionScalpData || !optionScalpData.limitOrdersContract || !signer)
        return;

      if (type === 'open') {
        await sendTx(
          optionScalpData.limitOrdersContract.connect(signer),
          'cancelOpenOrder',
          [id]
        );
      } else {
        await sendTx(
          optionScalpData.limitOrdersContract.connect(signer),
          'cancelCloseOrder',
          [id]
        );
      }
      await updateOptionScalpUserData();
      await getScalpOrders();
    },
    [optionScalpData, sendTx, signer, updateOptionScalpUserData, getScalpOrders]
  );

  return (
    <div className="rounded-lg bg-inherit w-fit-content h-fit-content px-5 flex flex-row">
      {orders && orders.length !== 0 ? (
        <div className="w-full h-full mb-4">
          <div className="flex flex-col space-y-4 py-2">
            <div className="flex flex-row w-full items-center justify-between">
              {tableHeadings.map((heading, index) => (
                <span key={index} className="text-xs md:text-sm w-full">
                  {heading}
                </span>
              ))}
              <div className="w-full"></div>
            </div>
            {orders?.map((order: any, index1: number) => (
              <div
                key={index1}
                className="flex flex-row w-full justify-center items-center space-x-2 md:space-x-0"
              >
                {ordersKeys.map((info) => getCellComponent(info, order))}
                <div className="flex flex-row justify-end w-full">
                  <Button
                    className="cursor-pointer text-white w-2 mr-2"
                    color={'primary'}
                    onClick={() => handleCancel(order.type, order.id)}
                  >
                    <span className="text-xs md:sm">Cancel</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <span className="ml-auto mr-auto text-[0.8rem] h-full mb-10 mt-4">
          Your orders will appear here
        </span>
      )}
    </div>
  );
};

export default OrdersTable;
