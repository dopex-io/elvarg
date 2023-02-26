import React from "react";

const PegHedgeIcon = ({ className = "" }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3.84613 10L16.1538 10"
        stroke="#8E8E8E"
        stroke-width="3"
        stroke-linecap="round"
      />
      <path
        d="M10 5.38464C7.45003 5.38464 5.38464 7.45003 5.38464 10C5.38464 12.55 7.45003 14.6154 10 14.6154C12.55 14.6154 14.6154 12.55 14.6154 10C14.6154 7.45003 12.55 5.38464 10 5.38464Z"
        fill="#C3F8FF"
      />
    </svg>
  );
};

export default PegHedgeIcon;
