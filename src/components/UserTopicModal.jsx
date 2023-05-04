import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  DocumentTextIcon,
  DocumentCheckIcon,
  PencilSquareIcon,
  ArrowUturnLeftIcon,
  XMarkIcon
} from "@heroicons/react/24/solid";
import { RiMailCheckFill } from "react-icons/ri";
import { Input, Button, Abstract, TopicCartIcon } from "../components";
import { gql, useMutation, useQuery } from "@apollo/client";

const UPDATE_TOPIC = gql`
  mutation UpdateTopicText($id: ID!, $text: String!) {
    updateTopic(input: { id: $id, text: $text }) {
      id
      text
    }
  }
`;

const UPDATE_ABSTRACT = gql`
  mutation UpdateAbstract($id: ID!, $text: String!) {
    updateAbstract(input: { id: $id, text: $text }) {
      id
      text
    }
  }
`;

const UserTopicModal = ({ open, setOpen, topic, refetchTopic }) => {
  const [editModeEnabled, setEditModeEnabled] = useState(false);

  const [modalFormData, setModalFormData] = useState({
    topicText: "",
    abstractText: ""
  });

  const cancelButtonRef = useRef(null);

  const abstractTextRef = useRef(null);
  useEffect(() => {
    if (abstractTextRef && abstractTextRef.current) {
      abstractTextRef.current.style.height = "auto";
      abstractTextRef.current.style.height = `${abstractTextRef.current.scrollHeight}px`;
    }
  }, [abstractTextRef, modalFormData, editModeEnabled]);

  const handleChange = (e, name) => {
    setModalFormData(prevState => ({ ...prevState, [name]: e.target.value }));
  };

  const handleCloseModal = () => {
    setEditModeEnabled(false);
    setOpen(false);
    refetchTopic();
  };

  const handleSave = event => {
    setEditModeEnabled(false);
    handleSubmitTopic();
    handleSubmitAbstract();
  };

  const handleSubmitTopic = () => {
    if (modalFormData.topicText === "") return;

    editTopic(topic.id, modalFormData.topicText);
  };

  const handleSubmitAbstract = () => {
    if (!topic.abstract || modalFormData.abstractText === "") return;

    editAbstract(topic.abstract.id, modalFormData.abstractText);
  };

  const editTopic = (topicId, newTopicText) => {
    const input = { id: topicId, text: newTopicText };

    topicUpdateData({ variables: input });
  };

  const [topicUpdateData] = useMutation(UPDATE_TOPIC, {
    ignoreResults: true,
    fetchPolicy: "no-cache",
    onError: error => console.log(error),
    onCompleted: data =>
      setModalFormData(prev => ({ ...prev, topicText: data.updateTopic.text }))
  });

  const editAbstract = (abstractId, newAbstractText) => {
    console.log("mutation");
    const input = { id: abstractId, text: newAbstractText };

    abstractUpdateData({ variables: input });
  };

  const [abstractUpdateData] = useMutation(UPDATE_ABSTRACT, {
    ignoreResults: true,
    fetchPolicy: "no-cache",
    onError: error => console.log(error),
    onCompleted: data =>
      setModalFormData(prev => ({
        ...prev,
        abstractText: data.updateAbstract.text
      }))
  });

  const displayedTopic = modalFormData.topicText
    ? modalFormData.topicText
    : topic?.text;

  const displayedAbstract = modalFormData.abstractText
    ? modalFormData.abstractText
    : topic?.abstract?.text;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={handleCloseModal}
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

        <div className="fixed inset-0 z-15 overflow-y-auto">
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-[#3A1F5C] px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full max-w-lg sm:p-6">
                <div>
                  {/*The icons reflect the current status. When you add statuses, update the icon possibilities. Submitted, writing, etc. If it's submitted, you shouldn't be able to edit it.*/}
                  {topic?.submitted ? (
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white">
                      <DocumentCheckIcon
                        className="h-6 w-6 text-[#3A1F5C]"
                        aria-hidden="true"
                      />
                    </div>
                  ) : (
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white">
                      <DocumentTextIcon
                        className="h-6 w-6 text-[#3A1F5C]"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-white"
                    >
                      {editModeEnabled ? (
                        <Input
                          key={topic.id}
                          handleChange={handleChange}
                          placeholder={topic.text}
                          name="topicText"
                          type="text"
                          defaultValue={displayedTopic}
                          customStyles={
                            "w-full rounded-lg outline-none text-white bg-[#4E376A]/75 placeholder-gray-400 border-violet-500 text-sm shadow-inner shadow-lg"
                          }
                        />
                      ) : (
                        displayedTopic
                      )}
                    </Dialog.Title>
                    {editModeEnabled && topic?.abstract ? (
                      <textarea
                        ref={abstractTextRef}
                        placeholder="Draft Abstract Here!"
                        name="abstractText"
                        type="text"
                        defaultValue={displayedAbstract}
                        onChange={e => handleChange(e, "abstractText")}
                        className={
                          "w-full rounded-lg outline-none text-white bg-[#4E376A]/75 placeholder-gray-400 border-violet-500 text-sm shadow-inner shadow-lg max-h-[350px] resize-none min-h-[100px] mb-11"
                        }
                      />
                    ) : (
                      <Abstract
                        topic={topic}
                        refetchTopic={refetchTopic}
                        editModeEnabled={editModeEnabled}
                        displayedAbstract={displayedAbstract}
                        displayedTopic={displayedTopic}
                      />
                    )}
                  </div>
                </div>
                <div className="mt-6 grid grid-flow-row-dense grid-cols-3 gap-3">
                  {editModeEnabled ? (
                    <button
                      onClick={handleSave}
                      className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4E376A] transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-blue-300"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={e => setEditModeEnabled(true)}
                      disabled={topic?.submitted}
                      className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4E376A] ${
                        topic?.submitted
                          ? "cursor-not-allowed"
                          : "transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      }`}
                    >
                      <PencilSquareIcon
                        className={`h-6 w-6 ${
                          topic?.submitted ? "text-gray-300" : "text-blue-300"
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  )}
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4E376A]/75">
                    {topic?.submitted ? (
                      <div className="text-blue-500 text-2xl">
                        <RiMailCheckFill />
                      </div>
                    ) : (
                      <TopicCartIcon topic={topic} />
                    )}
                  </div>
                  {editModeEnabled ? (
                    <button
                      onClick={() => setEditModeEnabled(false)}
                      className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4E376A]/75 transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      <XMarkIcon
                        className="h-6 w-6 text-blue-300"
                        aria-hidden="true"
                      />
                    </button>
                  ) : (
                    <button
                      onClick={handleCloseModal}
                      className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4E376A]/75 transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      <ArrowUturnLeftIcon
                        className="h-6 w-6 text-blue-300"
                        aria-hidden="true"
                      />
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default UserTopicModal;
