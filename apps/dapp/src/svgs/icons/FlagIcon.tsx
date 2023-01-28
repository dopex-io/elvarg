const FlagIcon = ({ className, fill }: any) => (
  <svg
    width="10"
    height="11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5.9 1.5 5.76.8a.582.582 0 0 0-.572-.467H1a.585.585 0 0 0-.583.584v8.75c0 .32.262.583.583.583.32 0 .583-.263.583-.583v-3.5H4.85l.14.7a.576.576 0 0 0 .572.466h3.021c.321 0 .584-.262.584-.583V2.083a.585.585 0 0 0-.584-.583H5.9Z"
      fill={fill}
    />
  </svg>
);

export default FlagIcon;
