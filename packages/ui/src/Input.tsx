import React, { ReactEventHandler, ReactNode } from "react";
import cx from "classnames";

interface InputProps {
  leftElement?: ReactNode;
  bottomElement?: ReactNode;
  variant?: string;
  color?: string;
  outline?: "mineshaft" | "down-bad" | "umbra";
  placeholder?: string;
  handleChange: ReactEventHandler;
}

const variants: Record<string, Record<string, string>> = {
  default: {
    box: "flex flex-col w-fit p-3 rounded-xl space-y-2",
    font: "h-10 text-2xl text-white ml-2 font-mono",
    textPosition: "text-right",
    alignment: "flex justify-between items-center",
  },
  variant1: {
    box: "flex flex-col w-fit rounded-md px-2 py-1 content-center",
    font: "h-auto text-white",
    textPosition: "text-left text-sm",
    alignment: "flex justify-between items-center",
  },
  variant2: {
    box: "flex flex-col w-fit rounded-md px-3 py-2 content-center",
    font: "h-auto text-white",
    textPosition: "text-left text-sm",
    alignment: "flex justify-between items-center",
  },
};

const bgColors: Record<string, string> = {
  "cod-gray": "bg-cod-gray",
  umbra: "bg-umbra",
};

const Input = (props: InputProps) => {
  const {
    leftElement,
    bottomElement,
    color = "umbra",
    variant = "default",
    outline = "umbra",
    placeholder = "",
    handleChange,
    ...rest
  } = props;

  return (
    <div
      className={cx(
        variants[variant].box,
        bgColors[color],
        `${outline ? `border border-${outline}` : "border-0"}`
      )}
    >
      <div className="flex justify-between">
        {leftElement}
        <input
          className={cx(
            variants[variant].input,
            variants[variant].textPosition,
            variants[variant].font,
            bgColors[color],
            "text-white text-right focus:outline-none"
          )}
          placeholder={placeholder}
          {...rest}
        />
      </div>
      {bottomElement}
    </div>
  );
};

Input.displayName = "Input";

export default Input;
