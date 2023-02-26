import React from "react";

const DropdownArrowIcon = ({ className = "" }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clip-path="url(#clip0_2644_2251)">
        <path
          d="M6.53248 8.7825L8.47498 10.725C8.76748 11.0175 9.23998 11.0175 9.53248 10.725L11.475 8.7825C11.9475 8.31 11.61 7.5 10.9425 7.5H7.05748C6.38998 7.5 6.05998 8.31 6.53248 8.7825Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_2644_2251">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default DropdownArrowIcon;
