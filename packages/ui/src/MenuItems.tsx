import React from 'react';

import { Menu } from '@headlessui/react';

import { MenuProps } from './Menu';
import cx from './utils/cx';

export type dropdownVariants = 'basic' | 'icon' | 'dense';

const COMMON_CLASSES = {
  background: 'bg-carbon',
  textSize: 'text-xs',
  textColor: 'text-white',
  ddFill: 'bg-umbra',
  dropDownPaper:
    'absolute left-0 mt-2 w-fit origin-top-right rounded-lg bg-umbra shadow-lg focus:outline-none',
};

const VARIANT_CLASSES: Record<
  dropdownVariants,
  Record<string, string | boolean | null>
> = {
  basic: {
    icons: null,
    padding: 'p-2',
    ...COMMON_CLASSES,
  },
  icon: {
    icons: null,
    padding: 'p-2',
    ...COMMON_CLASSES,
  },
  dense: {
    icons: 'hidden',
    padding: 'p-1',
    ...COMMON_CLASSES,
  },
};

export type ItemType = Record<
  symbol | string,
  string | boolean | number | JSX.Element | undefined
>;

export interface MenuItemsProps<T extends ItemType> extends MenuProps<T> {
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
    variant = 'basic',
    scrollable = false,
    topElement = null,
    className,
    ...rest
  } = props;

  const selectedVariant = VARIANT_CLASSES[variant];

  return (
    <Menu.Items
      className={cx(
        `absolute z-20 left-50 mt-2 origin-top-right rounded-[10px] bg-umbra shadow-lg focus:outline-none border border-carbon`,
        className
      )}
    >
      {topElement}
      <div
        className={`p-1 min-h-fit ${
          scrollable ? 'max-h-32 overflow-auto' : null
        }`}
      >
        {data.map((dataItem, index) => (
          <Menu.Item key={index}>
            {({ active }: { active: boolean }) => (
              <button
                className={`${
                  selectedVariant['padding']
                } flex justify-between rounded-md w-full ${
                  active ? 'bg-carbon' : 'bg-umbra'
                } text-sm ${
                  Boolean(Object(dataItem)['disabled'])
                    ? 'bg-opacity-50 text-stieglitz cursor-not-allowed'
                    : 'text-white cursor-pointer'
                }`}
                onClick={handleSelection}
                disabled={Boolean(Object(dataItem)['disabled'])}
                {...rest}
              >
                <div className="flex space-x-2">
                  {dataItem['icon'] && variant === 'icon'
                    ? (dataItem['icon'] as JSX.Element)
                    : null}
                  <div className="flex justify-between">
                    {Object(dataItem)['textContent']}
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

MenuItems.displayName = 'MenuItems';

export default MenuItems;
