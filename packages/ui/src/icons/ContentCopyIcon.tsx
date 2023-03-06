import React, { value SVGProps } from "react";

const ContentCopyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={14}
    height={14}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#content-copy-icon_svg__a)">
      <path
        d="M8.75.583H2.333A1.17 1.17 0 0 0 1.167 1.75v7.583c0 .321.262.584.583.584.32 0 .583-.263.583-.584v-7c0-.32.263-.583.584-.583H8.75c.32 0 .583-.263.583-.583A.585.585 0 0 0 8.75.583Zm2.333 2.334H4.667A1.17 1.17 0 0 0 3.5 4.083v8.167a1.17 1.17 0 0 0 1.167 1.167h6.416a1.17 1.17 0 0 0 1.167-1.167V4.083a1.17 1.17 0 0 0-1.167-1.166ZM10.5 12.25H5.25a.585.585 0 0 1-.583-.583v-7c0-.321.262-.584.583-.584h5.25c.32 0 .583.263.583.584v7c0 .32-.262.583-.583.583Z"
        fill="#fff"
      />
    </g>
    <defs>
      <clipPath id="content-copy-icon_svg__a">
        <path fill="#fff" d="M0 0h14v14H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default ContentCopyIcon;
