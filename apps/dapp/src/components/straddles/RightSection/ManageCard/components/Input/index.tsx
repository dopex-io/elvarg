import { ReactEventHandler } from 'react';

import { Input } from '@dopex-io/ui';

type InputSectionProps = {
  handleChange:
    | ReactEventHandler
    | ((e: {
        target: {
          value: any;
        };
      }) => void);
  value: string;
};

const InputSection = (props: InputSectionProps) => {
  return (
    <Input
      variant="xl"
      onChange={props.handleChange}
      placeholder="0.0"
      value={props.value}
      leftElement={
        <img
          src={`/images/tokens/${String('USDC')?.toLowerCase()}.svg`}
          alt={String('USDC')?.toLowerCase()}
          className="w-[30px] h-[30px] border border-mineshaft rounded-full ring-4 ring-cod-gray"
        />
      }
    />
  );
};

export default InputSection;
