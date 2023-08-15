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
    />
  );
};

export default InputSection;
