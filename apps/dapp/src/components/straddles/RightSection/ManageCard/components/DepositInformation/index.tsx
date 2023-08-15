import React from 'react';

import { InputAmountType } from '../..';

type DepositInformationProps = {
  inputAmount: InputAmountType;
};
const DepositInformation = (props: DepositInformationProps) => {
  return (
    <div className="w-full flex flex-col space-y-2">DepositInformation</div>
  );
};

export default DepositInformation;
