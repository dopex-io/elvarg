import React from "react";
import { Tab as HeadlessTab } from "@headlessui/react";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const SIZES: { [key: string]: string } = {
  small: "h-[1.875rem] w-[41.625rem]",
  medium: "h-[2.375rem] w-[46.375rem]",
  large: "h-[3.625rem] w-[50.5rem]",
};

function Tabs({
  categories,
  size,
}: {
  categories: { [head: string]: string };
  size: string;
}) {
  return (
    <HeadlessTab.Group>
      <HeadlessTab.List
        className={`flex space-x-1 rounded-lg bg-umbra border border-carbon p-1 ${SIZES[size]}`}
      >
        {Object.keys(categories).map((category) => (
          <HeadlessTab
            key={category}
            className={({ selected }) =>
              classNames(
                "w-full rounded-lg text-sm font-medium text-white",
                "focus:outline-none",
                selected
                  ? "bg-carbon shadow text-white"
                  : "text-stieglitz hover:bg-carbon/[0.12] hover:text-white"
              )
            }
          >
            {category}
          </HeadlessTab>
        ))}
      </HeadlessTab.List>
      <HeadlessTab.Panels className="mt-2">
        {Object.values(categories).map((_, idx) => (
          <HeadlessTab.Panel key={idx} className="rounded-xl bg-white p-3">
            {size}
          </HeadlessTab.Panel>
        ))}
      </HeadlessTab.Panels>
    </HeadlessTab.Group>
  );
}

export default Tabs;
