import React, { Fragment, ReactElement } from "react";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";

interface MenuProps<T> {
  scroll?: boolean;
  selection?: string;
  data: ReactElement<T>[];
}

const Menu = <T extends unknown>(props: MenuProps<T>) => {
  const { data, scroll = false, selection } = props;

  return (
    <HeadlessMenu as="div" className="relative inline-block text-left">
      <div>
        <HeadlessMenu.Button className="inline-flex w-full justify-center rounded-lg bg-carbon px-4 py-2 text-sm font-medium text-white">
          {selection}
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
        <HeadlessMenu.Items className="absolute left-0 mt-2 w-56 origin-top-right rounded-lg bg-umbra shadow-lg focus:outline-non">
          <div
            className={`p-1 border rounded-lg border-carbon h-full ${
              scroll ? "h-32 overflow-auto" : null
            }`}
          >
            {data.map((item) => item)}
          </div>
        </HeadlessMenu.Items>
      </Transition>
    </HeadlessMenu>
  );
};

Menu.displayName = "Menu";

export default Menu;
