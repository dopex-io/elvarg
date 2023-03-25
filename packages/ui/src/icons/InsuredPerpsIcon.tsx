import React, { SVGProps } from "react";

const InsuredPerpsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={20}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#insured-perps-icon_svg__a)">
      <path
        d="M14.167 9.167c.283 0 .558.033.833.075V6.317a1.65 1.65 0 0 0-1-1.525l-4.583-2a1.685 1.685 0 0 0-1.334 0l-4.583 2c-.608.266-1 .866-1 1.525v3c0 3.783 2.667 7.325 6.25 8.183a7.64 7.64 0 0 0 1.333-.458 4.982 4.982 0 0 1-.916-2.875c0-2.759 2.241-5 5-5Z"
        fill="#8E8E8E"
      />
      <path
        d="M14.167 10.833a3.332 3.332 0 1 0 0 6.667 3.332 3.332 0 1 0 0-6.667Z"
        fill="#C3F8FF"
      />
    </g>
    <defs>
      <clipPath id="insured-perps-icon_svg__a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default InsuredPerpsIcon;
