function Caution(props) {
  return (
    <svg
      width="26"
      height="26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="13" cy="13" r="13" fill="#1E1E1E" />
      <circle cx="13" cy="20" r="2" fill="#C4C4C4" />
      <rect x="11" y="4" width="4" height="12" rx="2" fill="#C4C4C4" />
    </svg>
  );
}

export default Caution;
