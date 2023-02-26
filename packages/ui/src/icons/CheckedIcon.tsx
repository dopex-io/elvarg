import React from "react";

const ContentCopyIcon = ({ className = "" }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clip-path="url(#clip0_2713_1901)">
        <path
          d="M7.49999 13.475L4.60833 10.5833C4.28333 10.2583 3.75833 10.2583 3.43333 10.5833C3.10833 10.9083 3.10833 11.4333 3.43333 11.7583L6.91666 15.2417C7.24166 15.5667 7.76666 15.5667 8.09166 15.2417L16.9083 6.42501C17.2333 6.10001 17.2333 5.57501 16.9083 5.25001C16.5833 4.92501 16.0583 4.92501 15.7333 5.25001L7.49999 13.475Z"
          fill="#22E1FF"
        />
      </g>
      <defs>
        <clipPath id="clip0_2713_1901">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ContentCopyIcon;
