import { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Loader } from '.';

const ExportAlert = ({
  showExportAlert,
  setShowExportAlert,
  docId,
  isLoading,
}) => {
  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleClick = () => {
    const url = `https://docs.google.com/document/d/${docId}/edit`;

    openInNewTab(url);
  };

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-20"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <Transition
          show={showExportAlert}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-2">
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-700" />
                  ) : (
                    <CheckCircleIcon
                      className="h-6 w-6 text-green-400"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="flex w-0 flex-1 justify-between">
                  {isLoading ? (
                    <p className="w-0 flex-1 text-sm font-medium text-gray-900">
                      Exporting...
                    </p>
                  ) : (
                    <>
                      <p className="w-0 flex-1 text-sm font-medium text-gray-900">
                        Export successful!
                      </p>
                      <button
                        onClick={handleClick}
                        type="button"
                        className="ml-3 flex-shrink-0 rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Visit
                      </button>
                    </>
                  )}
                </div>
                <div className="ml-4 flex flex-shrink-0">
                  <button
                    type="button"
                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => {
                      setShowExportAlert(false);
                    }}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
};

export default ExportAlert;
