import { useCallback, useMemo } from 'react';

import { IconButton } from '@mui/material';
import IosShare from '@mui/icons-material/IosShare';

import cx from 'classnames';

import { useBoundStore } from 'store';

import CustomButton from 'components/UI/Button';
import LimitOrderPopover from 'components/scalps/LimitOrderPopover';

const OrdersTable = () => {
  const { optionScalpUserData, optionScalpData } = useBoundStore();

  const orders = useMemo(() => {
    return [];
  }, [optionScalpUserData, optionScalpData]);

  const tableHeadings = ['Size', 'Collateral', 'Locked Liquidity', 'Expiry'];

  const ordersKeys = ['size', 'collateral', 'lockedLiquidity', 'expiry'];

  const getCellComponent = useCallback(
    (key: string, order: any) => {
      if (!optionScalpData) return null;
      // if (key === 'positions');
      let rightContent: string | null = null;
      let styles = '';
      let data = order[key];
      let dataStyle = '';
      let rightContentStyle = '';

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

  return (
    <div className="rounded-lg bg-inherit w-fit-content h-fit-content px-5 flex flex-row">
      {orders.length !== 0 ? (
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
            {orders.map((order: any, index1: number) => (
              <div
                key={index1}
                className="flex flex-row w-full justify-center items-center space-x-2 md:space-x-0"
              >
                {ordersKeys.map((info) => getCellComponent(info, order))}
                <div className="flex flex-row justify-end w-full">
                  {order.isOpen && (
                    <CustomButton
                      className="cursor-pointer text-white w-2 mr-2"
                      color={'primary'}
                      onClick={() => null}
                    >
                      <span className="text-xs md:sm">Close</span>
                    </CustomButton>
                  )}
                  {order.isOpen && <LimitOrderPopover />}
                  <IconButton
                    aria-label="share"
                    aria-haspopup="true"
                    onClick={() => null}
                    className="flex"
                    size="small"
                  >
                    <IosShare className="fill-current text-white opacity-90 hover:opacity-100 text-lg" />
                  </IconButton>
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
