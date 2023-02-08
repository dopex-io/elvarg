import React from "react";
import { Switch as HeadlessSwitch } from "@headlessui/react";

export interface SwitchProps {
  checked?: boolean;
  disabled?: boolean;
  size?: "small" | "medium";
  color?: "primary" | "jaffa" | "mineshaft";
  onChange?: () => void;
}

const BACKGROUND_COLORS = {
  primary: {
    root: "bg-primary",
    thumb: "bg-frost",
  },
  jaffa: {
    root: "bg-jaffa",
    thumb: "bg-white",
  },
  mineshaft: {
    root: "bg-mineshaft",
    thumb: "bg-frost",
  },
};

const SIZES = {
  small: {
    root: "h-4 w-10",
    thumb: "h-[14px] w-[14px]",
    checkedTranslate: "translate-x-[25px] ",
  },
  medium: {
    root: "h-5 w-10",
    thumb: "h-[18px] w-[18px]",
    checkedTranslate: "translate-x-[21px] ",
  },
};

const Switch = ({
  onChange,
  checked,
  color = "primary",
  disabled = false,
  size = "small",
}: SwitchProps) => {
  const bgColors = BACKGROUND_COLORS[color];
  const sizes = SIZES[size];

  return (
    <HeadlessSwitch
      onChange={onChange}
      checked={checked}
      disabled={disabled}
      className={`${
        checked ? bgColors.root : "bg-mineshaft"
      } relative inline-flex items-center rounded-full ${sizes.root} ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <div
        className={`${
          checked
            ? sizes.checkedTranslate + bgColors.thumb
            : "translate-x-[1.5px] bg-stieglitz"
        } inline-block transform rounded-full transition ${sizes.thumb}`}
      />
    </HeadlessSwitch>
  );
};

export default Switch;
