const ChartIndicator = (props) => {
  return (
    <svg
      width="20"
      height="21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="10"
        cy="10.082"
        r="7.5"
        fill="url(#paint0_linear)"
        stroke="url(#paint1_linear)"
        strokeWidth="5"
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="10"
          y1=".082"
          x2="10"
          y2="20.082"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#002EFF" stopOpacity="0" />
          <stop offset="1" stopColor="#002EFF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="10"
          y1=".082"
          x2="10"
          y2="20.082"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#002EFF" />
          <stop offset="1" stopColor="#22E1FF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ChartIndicator;
