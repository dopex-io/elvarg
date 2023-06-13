import { Fragment, ReactNode } from 'react';

import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';

import CloseIcon from './icons/CloseIcon';

export interface DialogProps {
  isOpen: boolean;
  showCloseIcon?: boolean;
  title: string;
  children: ReactNode;
  handleClose: () => void;
}

const Dialog = (props: DialogProps) => {
  const { isOpen, handleClose, showCloseIcon, children, title } = props;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <HeadlessDialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HeadlessDialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-cod-gray p-6 text-left align-middle shadow-xl transition-all">
                <HeadlessDialog.Title className="text-lg font-medium flex justify-between">
                  <span className="text-white">{title}</span>
                  {showCloseIcon ? (
                    <CloseIcon onClick={handleClose} className="text-white" />
                  ) : null}
                </HeadlessDialog.Title>
                {children}
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  );
};

export default Dialog;
