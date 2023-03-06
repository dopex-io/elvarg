import Button from "../src/Button";
import MenuItems, { dropdownVariants } from "../src/MenuItems";
import { ItemType } from "../src/MenuItems";
import DropdownArrowIcon from "./icons/DropdownArrowIcon";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import React, { ReactEventHandler } from "react";

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
          {({ open }: { open: boolean }) => (
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

Menu.displayName = "Menu";

export default Menu;
