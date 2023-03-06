import React, {  SVGProps } from "react";

const CheckedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={20}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#checked-icon_svg__a)">
      <path
        d="m7.5 13.475-2.892-2.892a.83.83 0 1 0-1.175 1.175l3.484 3.484a.83.83 0 0 0 1.175 0l8.816-8.817a.83.83 0 1 0-1.175-1.175L7.5 13.475Z"
        fill="#22E1FF"
      />
    </g>
    <defs>
      <clipPath id="checked-icon_svg__a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default CheckedIcon;
