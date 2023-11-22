import { Tab as HeadlessTab } from "@headlessui/react";
import { FC, ReactNode } from "react";

const SIZES: { [key: string]: string } = {
  small: "h-[1.875rem] w-[41.625rem]",
  medium: "h-[2.375rem] w-[46.375rem]",
  large: "h-[3.625rem] w-[50.5rem]",
};

export interface TabProps {
  children: ReactNode;
  className?: string;
  size?: string;
}

const Tab: FC<TabProps> = (props: TabProps) => {
  const { children, className = "", size = "medium" } = props;

  return (
    <HeadlessTab.Group>
      <HeadlessTab.List
        className={`${className} flex mt-2 space-x-1 rounded-lg bg-umbra border border-carbon p-1 ${SIZES[size]}`}
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
};

Tab.displayName = "Tab";

export default Tab;
