import { SVGProps } from 'react';

const ChipCloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    className="block m-auto text-inherit fill-current shrink-0 leading-none"
    viewBox="0 0 12 12"
    {...props}
  >
    <g
      fill="none"
      stroke="black"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
    >
      <line x1="4" y1="4" x2="8" y2="8" />
      <line x1="8" y1="4" x2="4" y2="8" />
    </g>
  </svg>
);

export default ChipCloseIcon;
