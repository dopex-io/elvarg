import React, { ReactNode, FC } from "react";
import { Tab as HeadlessTab } from "@headlessui/react";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export interface TabHeaderProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

const SIZES: { [key: string]: string } = {
  small: "h-[1.875rem] w-[41.625rem]",
  medium: "h-[2.375rem] w-[46.375rem]",
  large: "h-[3.625rem] w-[50.5rem]",
};

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

export function Tabs({
  children,
  size = "medium",
}: {
  children: ReactNode;
  size?: string;
}) {
  return (
    <HeadlessTab.Group>
      <HeadlessTab.List
        className={`flex mt-2 space-x-1 rounded-lg bg-umbra border border-carbon p-1 ${SIZES[size]}`}
      >
        {children}
      </HeadlessTab.List>
      <HeadlessTab.Panels className={`my-2 ${SIZES[size]}`}>
        <HeadlessTab.Panel className="rounded-lg bg-umbra text-white p-1">
          {size}
        </HeadlessTab.Panel>
      </HeadlessTab.Panels>
    </HeadlessTab.Group>
  );
}
