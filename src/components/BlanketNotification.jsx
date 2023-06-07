import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";

const BlanketNotification = ({ displayTitle, displayText, link, mutation }) => {
  const [show, setShow] = useState(true);

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex px-4 py-6 items-start p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm md:max-w-lg overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <InformationCircleIcon
                      className="h-7 w-7 text-indigo-700"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      {displayTitle}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{displayText}</p>
                    <div className="flex items-center">
                      {link ? (
                        <a
                          href={link}
                          className="mt-1 text-sm mr-2 text-indigo-500 hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          More Here
                        </a>
                      ) : null}
                      {true ? (
                        <button
                          onClick={mutation}
                          className="mt-1 text-sm cursor-pointer bg-indigo-500 rounded-lg text-white p-2 hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Got it!
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div
                    className={`ml-4 flex flex-shrink-0 ${
                      mutation ? "invisible" : null
                    }`}
                  >
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setShow(false);
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
    </>
  );
};

export default BlanketNotification;
