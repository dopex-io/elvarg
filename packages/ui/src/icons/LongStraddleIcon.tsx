import React, { value SVGProps } from "react";

const LongStraddleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={20}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.077 9.23V3.078L6.923 9.23h6.538l3.462-5.723V9.23H3.077Z"
      fill="#C3F8FF"
    />
    <path d="M10 11.539 8.846 8.462h2.308L10 11.539Z" fill="#FF617D" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.296 2.984c-.245-.56-.92-.825-1.509-.592-.588.234-.866.877-.621 1.438l5.769 13.186a1.122 1.122 0 0 0 .643.6 1.2 1.2 0 0 0 .89-.018c.26-.11.479-.312.597-.582l5.77-13.186c.244-.56-.034-1.204-.622-1.438-.588-.233-1.264.032-1.509.592L10 13.736 5.296 2.984Z"
      fill="#8E8E8E"
    />
  </svg>
);

export default LongStraddleIcon;
