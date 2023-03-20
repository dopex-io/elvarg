import { useCallback, useState } from 'react';

// import useSendTx from 'hooks/useSendTx';
import { useBoundStore } from 'store';

import CustomButton from 'components/UI/Button';
import Input from 'components/UI/Input';
import EstimatedGasCostButton from 'components/common/EstimatedGasCostButton';

const Delegate = () => {
  // const sendTx = useSendTx();
  // const [delegate, setRedeemDisabled] = useState<boolean>(true);
  const [value, setValue] = useState<number>(0);
  // const [/*redeemable, */ setRedeemable] = useState<boolean>(false);

  const {
    // accountAddress,
    // signer,
    chainId,
    userDscBondsData,
    // treasuryContractState,
  } = useBoundStore();

  const handleChange = useCallback((e: any) => {
    setValue(e.target.value);
  }, []);

  const handleDelegate = useCallback(async () => {
    //
  }, []);

  return (
    <div className="space-y-3 relative">
      <div className="bg-umbra rounded-xl w-full h-fit">
        <Input
          type="number"
          size="small"
          value={value}
          onChange={handleChange}
          placeholder="Bond ID"
          leftElement={
            <div className="flex my-auto space-x-2 w-2/3">
              <img
                src={`/images/tokens/${'DSC'?.toLowerCase()}.svg`}
                alt={'DSC'.toLowerCase()}
                className="w-[30px] h-[30px]"
              />
            </div>
          }
        />
        <div className="flex justify-between px-3 pb-3">
          <span className="text-stieglitz text-sm">Balance</span>
          <div className="flex space-x-1">
            <span className="text-sm">{userDscBondsData.bonds.length}</span>
            <span className="text-sm" color="stieglitz">
              Bonds
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-2 px-2">
        <div className="flex justify-between">
          <span className="text-sm text-stieglitz">Delegate Amount</span>
          <span className="text-sm text-stieglitz">{'-'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-stieglitz">Maturation Period</span>
          <span className="text-sm text-stieglitz">{'-'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-stieglitz">Bond Time</span>
          <span className="text-sm text-stieglitz">{'-'}</span>
        </div>
      </div>
      <div className="rounded-xl p-4 w-full bg-umbra">
        <div className="rounded-md flex flex-col mb-2.5 p-4 pt-2 pb-2.5 border border-neutral-800 w-full bg-neutral-800 space-y-2">
          <EstimatedGasCostButton gas={500000} chainId={chainId} />
          <div className="flex justify-between">
            <span className="text-sm text-stieglitz">Receive</span>
            <div className="flex my-auto space-x-2">
              <span className="text-sm text-stieglitz">{'-'}</span>
              <img
                src={`/images/tokens/${'DSC'?.toLowerCase()}.svg`}
                alt={'DSC'.toLowerCase()}
                className="w-[1rem] my-auto"
              />
            </div>
          </div>
        </div>
        <CustomButton
          size="medium"
          className="w-full mt-4 rounded-md"
          color="primary"
          onClick={handleDelegate}
        >
          Redeem
        </CustomButton>
      </div>
    </div>
  );
};

export default Delegate;
