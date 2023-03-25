import React, { SVGProps } from "react";

const DropdownArrowIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={18}
    height={18}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#dropdown-arrow-icon_svg__a)">
      <path
        d="m6.532 8.783 1.943 1.942a.747.747 0 0 0 1.057 0l1.943-1.942c.473-.473.135-1.283-.532-1.283H7.057c-.667 0-.997.81-.525 1.283Z"
        fill="#fff"
      />
    </g>
    <defs>
      <clipPath id="dropdown-arrow-icon_svg__a">
        <path fill="#fff" d="M0 0h18v18H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default DropdownArrowIcon;