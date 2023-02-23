import React, { ReactEventHandler } from "react";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";

import Button from "../src/Button";
import MenuItems, { dropdownVariants } from "../src/MenuItems";
import { ItemType } from "../src/MenuItems";

interface MenuProps<T> {
  data: T[];
  selection?: string;
  handleSelection: ReactEventHandler;
  dropdownVariant?: dropdownVariants;
  scrollable?: boolean;
  topElement?: React.ReactNode;
}

const Menu = <T extends ItemType>(props: MenuProps<T>) => {
  const {
    data,
    selection,
    handleSelection,
    dropdownVariant = "basic",
    scrollable = false,
    topElement = null,
    ...rest
  } = props;

  return (
    <HeadlessMenu as="div" className="inline-block text-left">
      <div>
        <HeadlessMenu.Button
          as={Button}
          className="flex justify-between bg-carbon"
          color="carbon"
          size="medium"
        >
          {({ open }) => (
            <div className="flex justify-between">
              {selection}
              <DropdownArrowIcon
                className={open ? `transform rotate-180` : ""}
              />
            </div>
          )}
        </HeadlessMenu.Button>
      </div>
      <Transition
        as="div"
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems
          data={data}
          handleSelection={handleSelection}
          variant={dropdownVariant}
          scrollable
          topElement={topElement}
          {...rest}
        />
      </Transition>
    </HeadlessMenu>
  );
};

const DropdownArrowIcon = ({ className = "" }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clip-path="url(#clip0_2644_2251)">
        <path
          d="M6.53248 8.7825L8.47498 10.725C8.76748 11.0175 9.23998 11.0175 9.53248 10.725L11.475 8.7825C11.9475 8.31 11.61 7.5 10.9425 7.5H7.05748C6.38998 7.5 6.05998 8.31 6.53248 8.7825Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_2644_2251">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

Menu.displayName = "Menu";

export default Menu;
