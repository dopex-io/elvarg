import { SVGProps } from 'react';

function Dropdown(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="10"
      height="6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="items-center"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.884399 1L4.41993 4.53553L5.12704 5.24264L5.83415 4.53553L9.36968 1L8.66257 0.292893L5.12704 3.82843L1.59151 0.292893L0.884399 1Z"
        fill="#fff"
      />
    </svg>
  );
}

export default Dropdown;
