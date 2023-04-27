import React, { FC, ReactNode } from "react";

type colors =
  | "primary"
  | "mineshaft"
  | "carbon"
  | "umbra"
  | "success"
  | "error";

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  color?: colors;
  size?: "xsmall" | "small" | "medium" | "large";
  variant?: "contained" | "outlined" | "text";
}

const SIZE_CLASSES = {
  xsmall: "px-[8px] py-[3px]",
  small: "px-[8px] py-[7px]",
  medium: "px-[8px] py-[9px]",
  large: "p-3",
};

const BACKGROUND_COLORS: { [key: string]: string } = {
  primary: "bg-primary",
  mineshaft: "bg-mineshaft",
  umbra: "bg-umbra",
  carbon: "bg-carbon",
  error: "bg-down-bad !text-black",
  success: "bg-up-only !text-black",
};

const BORDER_COLORS: { [key: string]: string } = {
  primary: "border-primary",
  mineshaft: "border-mineshaft",
  umbra: "border-umbra",
  error: "border-down-bad",
  success: "border-up-only",
};

const Button: FC<ButtonProps> = (props) => {
  const {
    children,
    className = "",
    variant = "contained",
    size = "medium",
    color = "primary",
    disabled = false,
    ...otherProps
  } = props;

  return (
    <button
      className={`
        ${className} ${
        variant === "contained" ? BACKGROUND_COLORS[color] : ""
      } text-sm rounded-[5px] w-full text-white ${SIZE_CLASSES[size]} ${
        variant === "outlined" ? `${BORDER_COLORS[color]} border` : ""
      } ${disabled ? "opacity-50" : "hover:opacity-80"}
      `}
      disabled={disabled}
      {...otherProps}
    >
      {children}
    </button>
  );
};

Button.displayName = "Button";

export default Button;
