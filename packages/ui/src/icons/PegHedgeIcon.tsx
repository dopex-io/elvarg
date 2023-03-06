import React, { SVGProps } from "react";

const PegHedgeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3.846 10h12.308" stroke="#8E8E8E" strokeWidth={3} strokeLinecap="round" />
    <path d="M10 5.385A4.614 4.614 0 0 0 5.385 10 4.614 4.614 0 0 0 10 14.615 4.614 4.614 0 0 0 14.615 10 4.614 4.614 0 0 0 10 5.385Z" fill="#C3F8FF" />
  </svg>
);

export default PegHedgeIcon;
