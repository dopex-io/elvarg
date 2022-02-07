const SmallArrowUpIcon = ({ className, subClassName, onClick }) => (
  <svg
    className={className}
    width="12"
    height="8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
    <path
      className={subClassName}
      d="M5.29.71.7 5.3a.996.996 0 1 0 1.41 1.41L6 2.83l3.88 3.88a.996.996 0 1 0 1.41-1.41L6.7.71a.996.996 0 0 0-1.41 0Z"
      fill="#fff"
    />
  </svg>
);

export default SmallArrowUpIcon;
