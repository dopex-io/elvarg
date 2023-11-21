import React from 'react';

import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

import cx from './utils/cx';

export type ItemType = Record<
  symbol | string,
  string | boolean | number | JSX.Element | undefined
>;

type colors =
  | 'primary'
  | 'mineshaft'
  | 'carbon'
  | 'umbra'
  | 'success'
  | 'error';

export interface MenuProps<T>
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  data: T[];
  selection: T;
  setSelection: (value: T) => void;
  dropdownVariant?: dropdownVariants;
  scrollable?: boolean;
  topElement?: React.ReactNode;
  color?: colors;
  showArrow?: boolean;
  fullWidth?: boolean;
  menuClassName?: string;
}

type dropdownVariants = 'basic' | 'icon' | 'dense';

const COMMON_CLASSES = {
  button: 'px-3 py-2 text-white rounded-md',
  dropdownPaper: 'absolute z-20 left-50 mt-2 origin-top-right',
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

const Menu = <T extends ItemType>(props: MenuProps<T>) => {
  const {
    data,
    selection,
    setSelection,
    dropdownVariant = 'basic',
    scrollable = false,
    topElement = null,
    color = 'carbon',
    showArrow = false,
    fullWidth = false,
    className,
    menuClassName,
    ...rest
  } = props;

  const selectedVariant = VARIANT_CLASSES[dropdownVariant];

  return (
    <Listbox value={selection} onChange={setSelection}>
      <div className={cx('relative mt-1', menuClassName)}>
        <Listbox.Button
          className={cx(
            `bg-${color}`,
            selectedVariant['button'],
            `h-fit ${fullWidth ? 'w-full' : 'w-fit'}`,
          )}
        >
          {({ open }: { open: boolean }) => (
            <div className="flex justify-center">
              {selection?.['textContent']}
              {showArrow ? (
                <ChevronDownIcon
                  className={cx(
                    'ml-2 w-4',
                    open ? `transform rotate-180` : null,
                  )}
                />
              ) : null}
            </div>
          )}
        </Listbox.Button>
        <Transition
          as="div"
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Listbox.Options
            className={cx(
              className
                ? className
                : `w-fit rounded-[10px] bg-umbra shadow-lg focus:outline-none border border-${color}`,
              `${selectedVariant['dropdownPaper']}`,
            )}
          >
            {topElement}
            <div
              className={`p-1 h-fit ${
                scrollable ? 'max-h-32 overflow-auto' : null
              }`}
            >
              {data.map((dataItem, index) => (
                <Listbox.Option
                  key={index}
                  value={dataItem}
                  disabled={Boolean(dataItem['disabled'])}
                >
                  {({ active }: { active: boolean }) => (
                    <div
                      className={cx(
                        selectedVariant['padding'],
                        active ? 'bg-white bg-opacity-10' : null,
                        `rounded-md w-full text-sm text-white ${
                          Boolean(dataItem['disabled'])
                            ? 'opacity-50 text-stieglitz cursor-not-allowed'
                            : 'cursor-pointer'
                        }`,
                      )}
                      key={index}
                      {...rest}
                    >
                      <span className="flex space-x-2">
                        {dataItem['icon'] && dropdownVariant === 'icon'
                          ? dataItem['icon']
                          : null}
                        <p>{dataItem['textContent']}</p>
                      </span>
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </div>
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

Menu.displayName = 'Menu';

export default Menu;
