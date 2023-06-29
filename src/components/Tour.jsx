import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { gql, useMutation } from "@apollo/client";
import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon
} from "@heroicons/react/24/solid";
import { FaComments } from "react-icons/fa";

const UPDATE_ONBOARDED = gql`
  mutation UpdateOnboarded($id: ID!) {
    updateUser(input: { id: $id, onboarded: true }) {
      id
      onboarded
    }
  }
`;

const TourBullet = ({ phase, bulletNumber, setPhase }) => {
  return (
    <div
      onClick={() => setPhase(bulletNumber)}
      className={`${phase === bulletNumber &&
        "h-6 w-6 border-2 border-white"} ${phase !== bulletNumber &&
        "h-3 w-3"} ${phase >= bulletNumber ? "bg-indigo-500" : "bg-white"}
    } rounded-full cursor-pointer hover:bg-indigo-300`}
    />
  );
};

const Tour = ({ userId, openTour, setOpenTour }) => {
  const COPY = [
    {
      title: "Welcome",
      body:
        "Intelligent Content Creation starts here. Curio uses the latest in AI to help you write faster by curating inspired topics."
    },
    {
      title: "What Is Curio?",
      body:
        "Curio is a topic generator - a customized curator - powered by OpenAI."
    },
    {
      title: "How Does It Work?",
      body:
        "You input keywords. Curio uses AI to suggest topics. You choose which ones to edit and save."
    },
    {
      title: "Why Curio?",
      body:
        "Because intelligent content creation starts with your curiosity. Curio uses AI to Accelerate Inspiration."
    },
    {
      title: "What Then?",
      body:
        "You export your final topics or add them to your cart to let the industry experts at Fixate draft your technical content."
    }
  ];

  const [phase, setPhase] = useState(0);

  const cancelButtonRef = useRef(null);

  const updateOnboarded = id => {
    const input = { id: id };
    updateOnboardedData({ variables: input });
  };

  const [updateOnboardedData] = useMutation(UPDATE_ONBOARDED, {
    onCompleted: data => console.log(data),
    onError: error => console.log(error)
  });

  const handleEndTour = () => {
    updateOnboarded(userId);
    setOpenTour(false);
  };

  const handleClick = forward => {
    forward ? setPhase(prev => prev + 1) : setPhase(prev => prev - 1);
  };

  const determineCopy = () => {
    return COPY[phase];
  };

  const displayedCopy = determineCopy();

  return (
    <Transition.Root show={openTour} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={handleEndTour}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-[#3A1F5C] px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <FaComments
                      className="h-6 w-6 text-[#3A1F5C]"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold leading-6 text-white"
                    >
                      {displayedCopy.title}
                    </Dialog.Title>
                    <div className="mt-2 bg-[#4E376A]/75 rounded-lg p-2 min-h-[75px]">
                      <p className="text-md text-white">{displayedCopy.body}</p>
                    </div>
                  </div>
                </div>
                <div className="flex mt-3 sm:mt-3 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  {phase === COPY.length - 1 ? (
                    <button
                      type="button"
                      className="flex w-2/3 justify-center items-center justify-self-center rounded-full bg-white cursor-pointer font-bold text-[#2D104F] text-sm transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={handleEndTour}
                    >
                      Let's Get Started!
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="flex w-1/6 justify-center rounded-full bg-white cursor-pointer font-semibold text-[#2D104F] text-sm transition delay-50 ease-in-out hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={() => handleClick(true)}
                    >
                      <ArrowRightCircleIcon className="h-10" />
                    </button>
                  )}

                  <button
                    type="button"
                    className={`inline-flex w-1/6 justify-self-end justify-center bg-white rounded-full cursor-pointer text-[#2D104F] transition delay-50 ease-in-out hover:scale-110 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                      phase === 0 ? "hidden" : null
                    }`}
                    onClick={() => handleClick(false)}
                    ref={cancelButtonRef}
                  >
                    <ArrowLeftCircleIcon className="h-10" />
                  </button>
                </div>
                <div className="flex justify-around items-center mt-5">
                  {COPY.map((title, i) => {
                    return (
                      <TourBullet
                        key={i}
                        phase={phase}
                        setPhase={setPhase}
                        bulletNumber={i}
                      />
                    );
                  })}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Tour;
