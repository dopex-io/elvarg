function Equal(props) {
  return (
    <svg
      width="16"
      height="16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="8" cy="8" r="7.5" stroke="#22E1FF" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 5H4V7H12V5ZM12 9H4V11H12V9Z"
        fill="#22E1FF"
      />
    </svg>
  );
}

export default Equal;
