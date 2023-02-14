import React, { Fragment } from "react";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";

type variants = "basic" | "icon" | "dense";

const COMMON_CLASSES = {
  background: "bg-carbon",
  textSize: "text-xs",
  textColor: "text-white",
  ddFill: "bg-umbra",
  dropDownPaper:
    "absolute left-0 mt-2 w-56 origin-top-right rounded-lg bg-umbra shadow-lg focus:outline-none",
  dropDownBorder: "border border-carbon",
};

const VARIANT_CLASSES: Record<
  variants,
  Record<string, string | boolean | null>
> = {
  basic: {
    icons: null,
    menuItem: "p-2",
    ...COMMON_CLASSES,
  },
  icon: {
    icons: null,
    menuItem: "p-2",
    ...COMMON_CLASSES,
  },
  dense: {
    icons: "hidden",
    menuItem: "p-1",
    ...COMMON_CLASSES,
  },
};

interface MenuProps {
  variant?: variants;
  scroll?: boolean;
  data: any[];
  children?: React.ReactNode;
  selection?: string | Record<string, string>;
  onChange: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
}

const Menu = (props: MenuProps) => {
  const {
    variant = "basic",
    data,
    scroll = false,
    selection,
    onChange,
  } = props;

  const selectedVariant = VARIANT_CLASSES[variant];

  return (
    <HeadlessMenu as="div" className="relative inline-block text-left">
      <div>
        <HeadlessMenu.Button className="inline-flex w-full justify-center rounded-lg bg-carbon px-4 py-2 text-sm font-medium text-white">
          {typeof selection === "string"
            ? selection
            : selection?.["textContent"]}
        </HeadlessMenu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <HeadlessMenu.Items className={`${selectedVariant["dropDownPaper"]}`}>
          <div
            className={`p-1 border rounded-lg border-carbon h-full ${
              scroll ? "h-32 overflow-auto" : null
            }`}
          >
            {data.map((dataItem) => (
              <HeadlessMenu.Item>
                <button
                  className={`${
                    selectedVariant["menuItem"]
                  } flex justify-between rounded-md w-full hover:bg-mineshaft text-sm ${
                    dataItem["disabled"]
                      ? "bg-opacity-50 text-stieglitz cursor-not-allowed"
                      : "text-white cursor-pointer"
                  }`}
                  onClick={onChange}
                  disabled={dataItem["disabled"]}
                >
                  {typeof dataItem === "object" ? (
                    <>
                      <div className="flex space-x-2">
                        {dataItem["icon"] ? dataItem["icon"] : null}
                        <div className={`flex justify-between`}>
                          {dataItem["textContent"]}
                        </div>
                      </div>
                      {dataItem["textContent"] === selection ? (
                        <CheckedIcon
                          className={`ml-1 my-auto ${selectedVariant["icons"]}`}
                        />
                      ) : null}
                    </>
                  ) : (
                    <>
                      <div className={`flex justify-between`}>{dataItem}</div>
                      {dataItem === selection ? (
                        <CheckedIcon
                          className={`ml-1 my-auto ${selectedVariant["icons"]}`}
                        />
                      ) : null}
                    </>
                  )}
                </button>
              </HeadlessMenu.Item>
            ))}
          </div>
        </HeadlessMenu.Items>
      </Transition>
    </HeadlessMenu>
  );
};

const CheckedIcon = ({ className = "" }) => {
  return (
    <svg
      width="15"
      height="11"
      viewBox="0 0 15 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4.49999 8.47497L1.60833 5.58331C1.28333 5.25831 0.758325 5.25831 0.433325 5.58331C0.108325 5.90831 0.108325 6.43331 0.433325 6.75831L3.91666 10.2416C4.24166 10.5666 4.76666 10.5666 5.09166 10.2416L13.9083 1.42498C14.2333 1.09998 14.2333 0.574976 13.9083 0.249976C13.5833 -0.0750244 13.0583 -0.0750244 12.7333 0.249976L4.49999 8.47497Z"
        fill="#22E1FF"
      />
    </svg>
  );
};

Menu.displayName = "Menu";

export default Menu;
