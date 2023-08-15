import { ReactNode } from 'react';

const InformationPill = (props: { label?: ReactNode; value?: ReactNode }) => {
  return (
    <div className="w-full flex justify-between">
      <span className="text-stieglitz">{props.label}</span>
      <span>{props.value}</span>
    </div>
  );
};

export default InformationPill;
