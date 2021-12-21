function Gohm(props) {
  return (
    <svg
      width="32"
      height="32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="7.094"
        y="7.094"
        width="24"
        height="24"
        rx="106.406"
        fill="#fff"
      />
      <path fill="#fff" d="M63.56 63.787h99.88v99.88H63.56z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M124.396 163.44v.227h39.044v-14.074h-19.281c11.601-8.789 19.054-22.452 19.054-37.796 0-26.515-22.257-48.01-49.713-48.01s-49.713 21.495-49.713 48.01c0 15.344 7.453 29.007 19.054 37.796H63.56v14.074h39.043v-18.916c-14.226-4.478-24.516-17.488-24.516-32.84 0-19.056 15.855-34.504 35.412-34.504 19.558 0 35.412 15.448 35.412 34.504 0 15.352-10.29 28.362-24.516 32.84v18.689Z"
        fill="#708B96"
      />
      <rect
        x="7.094"
        y="7.094"
        width="24"
        height="24"
        rx="106.406"
        stroke="url(#a)"
        strokeWidth="14.188"
      />
      <defs>
        <linearGradient
          id="a"
          x1="113.5"
          y1="-119.175"
          x2="113.5"
          y2="363.2"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".195" stopColor="#708B96" />
          <stop offset="1" stopColor="#F7FBE7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default Gohm;
