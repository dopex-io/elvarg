import React from "react";
import { Menu } from "@headlessui/react";

export type dropdownVariants = "basic" | "icon" | "dense";

const COMMON_CLASSES = {
  background: "bg-carbon",
  textSize: "text-xs",
  textColor: "text-white",
  ddFill: "bg-umbra",
  dropDownPaper:
    "absolute left-0 mt-2 w-56 origin-top-right rounded-lg bg-umbra shadow-lg focus:outline-none",
};

const VARIANT_CLASSES: Record<
  dropdownVariants,
  Record<string, string | boolean | null>
> = {
  basic: {
    icons: null,
    padding: "p-2",
    ...COMMON_CLASSES,
  },
  icon: {
    icons: null,
    padding: "p-2",
    ...COMMON_CLASSES,
  },
  dense: {
    icons: "hidden",
    padding: "p-1",
    ...COMMON_CLASSES,
  },
};

export type ItemType = Record<
  symbol | string,
  string | boolean | number | JSX.Element | undefined
>;

interface MenuItemsProps<T extends ItemType> {
  data: T[];
  variant?: dropdownVariants;
  scrollable?: boolean;
  topElement?: React.ReactNode;
  handleSelection: React.ReactEventHandler<Element>;
}

const MenuItems: React.FC<MenuItemsProps<ItemType>> = <T extends ItemType>(
  props: MenuItemsProps<T>
) => {
  const {
    data,
    handleSelection,
    variant = "basic",
    scrollable = false,
    topElement = null,
    ...rest
  } = props;

  const selectedVariant = VARIANT_CLASSES[variant];

  return (
    <Menu.Items
      className={`absolute left-50 mt-2 w-56 origin-top-right rounded-[10px] bg-umbra shadow-lg focus:outline-none border border-carbon`}
      {...rest}
    >
      {topElement}
      <div
        className={`p-1 min-h-fit ${
          scrollable ? "max-h-32 overflow-auto" : null
        }`}
      >
        {data.map((dataItem) => (
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  selectedVariant["padding"]
                } flex justify-between rounded-md w-full ${
                  active ? "bg-carbon" : "bg-umbra"
                } text-sm ${
                  Boolean(Object(dataItem)["disabled"])
                    ? "bg-opacity-50 text-stieglitz cursor-not-allowed"
                    : "text-white cursor-pointer"
                }`}
                onClick={handleSelection}
                disabled={Boolean(Object(dataItem)["disabled"])}
              >
                <div className="flex space-x-2">
                  {dataItem["icon"] && variant === "icon"
                    ? (dataItem["icon"] as JSX.Element)
                    : null}
                  <div className="flex justify-between">
                    {Object(dataItem)["textContent"]}
                  </div>
                </div>
              </button>
            )}
          </Menu.Item>
        ))}
      </div>
    </Menu.Items>
  );
};

Menu.displayName = "MenuItems";

export default MenuItems;
