const LegendIcon = ({ className, color }: any) => (
  <svg
    width="9"
    height="10"
    viewBox="0 0 9 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect y="5" width="6" height="6" transform="rotate(-45 0 5)" fill={color} />
  </svg>
);

export default LegendIcon;
