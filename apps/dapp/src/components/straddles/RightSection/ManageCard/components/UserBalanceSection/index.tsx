import { SVGProps } from 'react';

const collateralTokenSymbol = 'USDC';
const UserBalanceSection = (props: {
  userBalance: string;
  isPurchase: boolean;
}) => {
  return (
    <div className="w-full h-max-content rounded-md flex space-x-1">
      <div className="w-full h-full bg-umbra rounded-l-md rounded-r-none flex justify-between items-center text-stieglitz text-sm px-3">
        <span>{props.isPurchase ? 'Purchase' : 'Deposit'} with</span>
        <span>{props.userBalance}</span>
      </div>
      <div className="cursor-not-allowed w-max-content w-max-content bg-mineshaft rounded-r-md rounded-l-none text-center flex items-center justify-center text-sm py-2 px-3 space-x-2">
        <span>{collateralTokenSymbol}</span>
        <ArrowDropDown />
      </div>
    </div>
  );
};

const ArrowDropDown = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="5"
      height="4"
      viewBox="0 0 5 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0.58066 1.83083L2.09149 3.34166C2.31899 3.56916 2.68649 3.56916 2.91399 3.34166L4.42483 1.83083C4.79233 1.46333 4.52983 0.833328 4.01066 0.833328H0.988993C0.469826 0.833328 0.21316 1.46333 0.58066 1.83083Z"
        fill="white"
      />
    </svg>
  );
};

export default UserBalanceSection;
