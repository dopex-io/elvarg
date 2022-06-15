const SettingsIcon = ({ className, subClassName }: any) => (
  <svg
    width="18"
    height="18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M0 15c0 .55.45 1 1 1h5v-2H1c-.55 0-1 .45-1 1ZM0 3c0 .55.45 1 1 1h9V2H1c-.55 0-1 .45-1 1Zm10 14v-1h7c.55 0 1-.45 1-1s-.45-1-1-1h-7v-1c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1ZM4 7v1H1c-.55 0-1 .45-1 1s.45 1 1 1h3v1c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1Zm14 2c0-.55-.45-1-1-1H8v2h9c.55 0 1-.45 1-1Zm-5-3c.55 0 1-.45 1-1V4h3c.55 0 1-.45 1-1s-.45-1-1-1h-3V1c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1Z"
      fill="#3E3E3E"
      className={subClassName}
    />
  </svg>
);

export default SettingsIcon;
