import { ReactNode } from 'react';

import { Tab as HeadlessTab } from '@headlessui/react';

export const List = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className: string;
}) => {
  return (
    <HeadlessTab.List
      className={`${className} flex mt-2 space-x-1 rounded-lg bg-umbra border border-carbon p-1`}
    >
      {children}
    </HeadlessTab.List>
  );
};

export const Panels = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className: string;
}) => {
  return (
    <HeadlessTab.Panels className={`${className} my-2`}>
      {children}
    </HeadlessTab.Panels>
  );
};

export const Panel = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className: string;
}) => {
  return (
    <HeadlessTab.Panel
      className={`${className} rounded-lg bg-umbra text-white p-1`}
    >
      {children}
    </HeadlessTab.Panel>
  );
};
