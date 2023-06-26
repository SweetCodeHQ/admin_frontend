import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const FlyoutMenu = ({ menuState, handleState, options, menuName }) => {
  const handleClick = i => {
    handleState(i);
  };

  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-white">
        <span>{menuState || "SELECT TYPE"}</span>
        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left z-10 mt-5 flex w-screen max-w-max px-4">
          <div className="w-screen max-w-sm flex-auto rounded-3xl bg-white p-4 text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
            {options.map((option, i) => (
              <Popover.Button
                key={option.name}
                className="relative rounded-lg p-4 hover:bg-gray-100"
                onClick={() => {
                  handleClick(i);
                }}
              >
                <div className="font-semibold text-gray-900">
                  <div className="flex justify-between">
                    <h4 className="mr-3">{option.name}</h4>
                    <h4>{`${option.credits} ${
                      option.credits === 1 ? "credit" : "credits"
                    }`}</h4>
                  </div>
                </div>
                <p className="mt-1 text-start text-gray-500">
                  {option.description}
                </p>
              </Popover.Button>
            ))}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default FlyoutMenu;
