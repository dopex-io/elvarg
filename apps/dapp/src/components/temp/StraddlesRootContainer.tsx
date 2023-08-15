import { Children, PropsWithChildren } from 'react';

const StraddlesRootContainer = (props: PropsWithChildren) => {
  return (
    <div className=" h-[100vh] w-[75vw] flex flex-row">{props.children}</div>
  );
};

export default StraddlesRootContainer;
