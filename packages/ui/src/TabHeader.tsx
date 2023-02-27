import { Tab as HeadlessTab } from "@headlessui/react";
import React, { ReactNode, FC } from "react";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export interface TabHeaderProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export const TabHeader: FC<TabHeaderProps> = (props) => {
  const { children, className = "", disabled = false, ...otherProps } = props;

  return (
    <HeadlessTab
      disabled={disabled}
      className={({ selected }) =>
        classNames(
          "w-full rounded-lg text-sm font-medium text-white",
          "focus:outline-none",
          otherProps,
          disabled
            ? "bg-carbon/[0.5] text-stieglitz/[0.5]"
            : selected
            ? "bg-carbon"
            : "text-stieglitz hover:bg-carbon hover:text-white"
        )
      }
    >
      {children}
    </HeadlessTab>
  );
};

TabHeader.displayName = "TabHeader";

export default TabHeader;
