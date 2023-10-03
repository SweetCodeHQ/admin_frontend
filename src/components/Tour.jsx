import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { gql, useMutation } from "@apollo/client";
import { PrivacyPolicy } from "../components";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import tourBackground from "../assets/tourBackground.png";
import curioLogo from "../assets/curioLogo2.png";

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
      className={`h-4 w-4 ${phase === bulletNumber &&
        "border-2 border-white"} ${phase < bulletNumber &&
        "bg-white"} ${phase === bulletNumber && "bg-indigo-500"} ${phase >
        bulletNumber && "bg-[#ffc857]"}
    } rounded-full cursor-pointer hover:bg-indigo-300`}
    />
  );
};

const Tour = ({ userId, openTour, setOpenTour }) => {
  const COPY = [
    {
      title: "What is Curio?",
      body:
        "Intelligent Content Creation starts here. Curio uses the latest in AI to help you write faster by curating inspired topics."
    },
    {
      title: "How Does Curio Work?",
      body:
        "You input keywords. AI + Curio's digital experts suggest topics. You choose which ones you want to edit and save."
    },
    {
      title: "Why Curio?",
      body:
        "Because Curio adds industry expertise, accelerates inspiration, breaks through writer's block, and saves you time."
    },
    {
      title: "What Then?",
      body:
        "You export your final topics or send them to the industry experts at Fixate IO who will wrap it up."
    },
    {
      title: "Privacy",
      body:
        "We take your privacy very seriously. Please read our privacy policy linked below to see exactly what we do with your data."
    }
  ];

  const [phase, setPhase] = useState(0);
  const [clickedPrivacyPolicy, setClickedPrivacyPolicy] = useState(false);

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
      <Dialog as="div" className="relative z-10" onClose={handleEndTour}>
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
          {clickedPrivacyPolicy ? (
            <div className="z-50 overflow-y-scroll overscroll-none fixed top-0 w-screen h-screen shadow-2xl flex flex-col rounded-md blue-glassmorphism animate-slide-in transition ease-in-out">
              <PrivacyPolicy
                setClickedPrivacyPolicy={setClickedPrivacyPolicy}
              />
            </div>
          ) : null}
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
              <Dialog.Panel
                style={{ backgroundImage: `url(${tourBackground})` }}
                className="relative transform overflow-hidden bg-cover rounded-lg bg-[#3A1F5C] px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
              >
                <div>
                  <div className="mx-auto flex h-12 w-14 items-center justify-center rounded-full bg-white">
                    <img
                      src={curioLogo}
                      className="bg-[#3A1F5C] rounded-full"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold leading-6 text-white"
                    >
                      {displayedCopy.title}
                    </Dialog.Title>
                    <div className="mt-2 bg-[#4E376A]/75 rounded-lg pt-3 min-h-[75px]">
                      <p className="text-md text-white">{displayedCopy.body}</p>
                    </div>
                    {phase === 4 ? (
                      <button
                        className="underline text-white mt-2"
                        onClick={() => setClickedPrivacyPolicy(true)}
                      >
                        View Privacy Policy
                      </button>
                    ) : null}
                  </div>
                </div>
                <div
                  className={`flex ${
                    phase === 4 ? "mt-3" : "mt-10"
                  } sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3`}
                >
                  {phase === COPY.length - 1 ? (
                    <button
                      type="button"
                      className="flex w-2/3 justify-center items-center justify-self-center rounded-full bg-white cursor-pointer font-bold text-[#2D104F] text-sm transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={handleEndTour}
                    >
                      Accept & Continue
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="flex w-1/6 justify-center rounded-full px-1 ml-5 bg-[#2D104F] cursor-pointer font-semibold text-white border-2 transition delay-50 ease-in-out hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={() => handleClick(true)}
                    >
                      <ChevronRightIcon className="h-9" />
                    </button>
                  )}

                  <button
                    type="button"
                    className={`inline-flex w-1/6 px-1 mr-5 justify-self-end bg-[#2D104F] rounded-full cursor-pointer border-2 text-white transition delay-50 ease-in-out hover:scale-110 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                      phase === 0 ? "hidden" : null
                    }`}
                    onClick={() => handleClick(false)}
                  >
                    <ChevronLeftIcon className="h-9" />
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
