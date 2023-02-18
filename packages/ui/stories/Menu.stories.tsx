import React, { ReactEventHandler, useCallback } from "react";
import { ComponentMeta } from "@storybook/react";
import { Menu as HeadlessMenu } from "@headlessui/react";

import Menu from "../src/Menu";

const meta: ComponentMeta<typeof Menu> = {
  title: "Menu",
  component: Menu,
};

export default meta;

type ItemType = {
  textContent: string;
  icon?: boolean | JSX.Element;
  disabled?: boolean;
};

export const Default = () => {
  const handleSelection: ReactEventHandler = useCallback((e: any) => {
    setSelection(e.target.textContent);
  }, []);

  const data: ItemType[] = [
    {
      textContent: "Menu Item 1",
      icon: false,
      disabled: false,
    },
    {
      textContent: "Menu Item 2",
      icon: false,
      disabled: false,
    },
    {
      textContent: "Menu Item 3",
      icon: false,
      disabled: true,
    },
  ];

  const [selection, setSelection] = React.useState<any>(data[0].textContent);

  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
      }}
    >
      <div className="fixed top-16 text-right">
        <Menu<ItemType>
          data={data.map((item, i) => (
            <MenuItem key={i} item={item} handleSelection={handleSelection} />
          ))}
          selection={selection}
        />
      </div>
    </div>
  );
};

export const IconMenu = () => {
  const handleSelection: ReactEventHandler = useCallback((e: any) => {
    setSelection(e.target.textContent);
  }, []);

  const data = [
    {
      textContent: "Straddles",
      icon: <LongStraddleIcon />,
      disabled: false,
    },
    {
      textContent: "Insured Perps",
      icon: <InsuredPerpsIcon />,
      disabled: false,
    },
    {
      textContent: "Peg Hedge",
      icon: <PegHedgeIcon />,
      disabled: true,
    },
  ];

  const [selection, setSelection] = React.useState<any>(data[0].textContent);

  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
      }}
    >
      <div className="fixed top-16 text-right">
        <Menu
          data={data.map((item, i) => (
            <MenuItem
              key={i}
              item={item}
              variant="icon"
              handleSelection={handleSelection}
            />
          ))}
          selection={selection}
        />
      </div>
    </div>
  );
};

export const DenseMenu = () => {
  const data = [
    {
      textContent: "Menu Item 1",
    },
    {
      textContent: "Menu Item 2",
    },
    { textContent: "Menu Item 3", disabled: true },
    { textContent: "Menu Item 4" },
    { textContent: "Menu Item 5" },
  ];
  const [selection, setSelection] = React.useState<string>(data[0].textContent);

  const handleSelection = useCallback((e: { target: any }) => {
    setSelection(e.target.textContent);
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
      }}
    >
      <div className="fixed top-16 text-right">
        <Menu
          scroll
          data={data.map((item, i) => (
            <MenuItem
              key={i}
              item={item}
              variant="dense"
              handleSelection={handleSelection}
            />
          ))}
          selection={selection}
        />
      </div>
    </div>
  );
};

/* ===================== Templates & Icons ===================== */

// MenuItem template #1

interface MenuItemProps {
  item: ItemType;
  variant?: variants;
  handleSelection: any;
}

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

const MenuItem = ({
  item,
  handleSelection,
  variant = "basic",
  ...rest
}: MenuItemProps) => {
  const selectedVariant = VARIANT_CLASSES[variant];

  return (
    <HeadlessMenu.Item>
      <button
        className={`${
          selectedVariant["padding"]
        } flex justify-between rounded-md w-full hover:bg-mineshaft text-sm ${
          item["disabled"]
            ? "bg-opacity-50 text-stieglitz cursor-not-allowed"
            : "text-white cursor-pointer"
        }`}
        onClick={handleSelection}
        disabled={item["disabled"]}
        {...rest}
      >
        <div className="flex space-x-2">
          {item["icon"] && variant === "icon" ? item["icon"] : null}
          <div className="flex justify-between">{item["textContent"]}</div>
        </div>
      </button>
    </HeadlessMenu.Item>
  );
};

// Icons

const LongStraddleIcon = ({ className = "" }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3.0769 9.23075V3.0769L6.92306 9.23075H7.50783H13.4615L16.9231 3.50767V9.23075H13.4615H7.50783H6.92306H3.0769Z"
        fill="#C3F8FF"
      />
      <path
        d="M9.99998 11.5385L8.84613 8.46155H11.1538L9.99998 11.5385Z"
        fill="#FF617D"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.29584 2.9842C5.05074 2.42399 4.37519 2.15907 3.78696 2.39249C3.19873 2.62592 2.92056 3.26928 3.16566 3.8295L8.93489 17.0161C9.05313 17.2864 9.27155 17.4879 9.53201 17.5979C9.54734 17.6044 9.56281 17.6105 9.57842 17.6164C9.71672 17.6681 9.85947 17.6927 9.99999 17.6926C10.141 17.6927 10.2844 17.6679 10.4232 17.6158C10.4382 17.6101 10.4532 17.6041 10.4679 17.5979C10.7284 17.4879 10.9468 17.2864 11.0651 17.0161L16.8343 3.8295C17.0794 3.26928 16.8012 2.62592 16.213 2.39249C15.6248 2.15907 14.9492 2.42399 14.7041 2.9842L9.99998 13.7364L5.29584 2.9842Z"
        fill="#8E8E8E"
      />
    </svg>
  );
};

const InsuredPerpsIcon = ({ className = "" }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clip-path="url(#clip0_2599_22797)">
        <path
          d="M14.1667 9.16667C14.45 9.16667 14.725 9.20001 15 9.24167V6.31667C15 5.65001 14.6083 5.05001 14 4.79167L9.41667 2.79167C8.99167 2.60834 8.50833 2.60834 8.08333 2.79167L3.5 4.79167C2.89167 5.05834 2.5 5.65834 2.5 6.31667V9.31667C2.5 13.1 5.16667 16.6417 8.75 17.5C9.20833 17.3917 9.65 17.2333 10.0833 17.0417C9.50833 16.225 9.16667 15.2333 9.16667 14.1667C9.16667 11.4083 11.4083 9.16667 14.1667 9.16667Z"
          fill="#8E8E8E"
        />
        <path
          d="M14.1666 10.8333C12.325 10.8333 10.8333 12.325 10.8333 14.1666C10.8333 16.0083 12.325 17.5 14.1666 17.5C16.0083 17.5 17.5 16.0083 17.5 14.1666C17.5 12.325 16.0083 10.8333 14.1666 10.8333Z"
          fill="#C3F8FF"
        />
      </g>
      <defs>
        <clipPath id="clip0_2599_22797">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const PegHedgeIcon = ({ className = "" }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3.84613 10L16.1538 10"
        stroke="#8E8E8E"
        stroke-width="3"
        stroke-linecap="round"
      />
      <path
        d="M10 5.38464C7.45003 5.38464 5.38464 7.45003 5.38464 10C5.38464 12.55 7.45003 14.6154 10 14.6154C12.55 14.6154 14.6154 12.55 14.6154 10C14.6154 7.45003 12.55 5.38464 10 5.38464Z"
        fill="#C3F8FF"
      />
    </svg>
  );
};
