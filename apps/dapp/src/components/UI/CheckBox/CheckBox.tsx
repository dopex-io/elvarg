import { CheckIcon } from '@heroicons/react/24/solid';
import {
  CheckboxIndicatorProps,
  CheckboxProps,
  Indicator,
  Root,
} from '@radix-ui/react-checkbox';

import { cn } from 'utils/general';

type CheckBoxProps = {
  indicatorProps?: CheckboxIndicatorProps;
} & CheckboxProps;
const CheckBox = (props: CheckBoxProps) => {
  return (
    <Root
      {...props}
      className={cn(
        'w-[14px] h-[14px] rounded-sm border-2 border-stieglitz',
        props.checked && 'bg-wave-blue border-0',
        props.disabled && 'border-carbon',
        props.className,
      )}
    >
      <Indicator
        {...props.indicatorProps}
        className={cn('text-umbra', props.indicatorProps?.className)}
      >
        <CheckIcon height={'100%'} width={'100%'} />
      </Indicator>
    </Root>
  );
};

export default CheckBox;
