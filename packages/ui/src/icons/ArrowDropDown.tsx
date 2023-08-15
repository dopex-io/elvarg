import { SVGProps } from 'react';

const ArrowDropDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="m.58 1.83 1.511 1.512a.58.58 0 0 0 .823 0l1.51-1.511a.585.585 0 0 0-.413-.998H.989c-.52 0-.776.63-.408.998Z"
    />
  </svg>
);
export default ArrowDropDown;
