import { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon
} from '@heroicons/react/24/solid';
import curioCircleLogo from '../assets/curioCircleLogo.png'
import { useMutation } from '@apollo/client';
import { UPDATE_TOPIC_TEXT, UPDATE_ABSTRACT } from '../graphql/mutations';
import { Input, Abstract, BasicAlert, ExportButton, ClipboardButton } from '.';
import { callMutation } from '../utils/callMutation';

const UserTopicModal = ({ open, setOpen, topic, refetchTopic, userId }) => {
  const [editModeEnabled, setEditModeEnabled] = useState(false);

  const [modalFormData, setModalFormData] = useState({
    topicText: '',
    abstractText: '',
  });

  const [showAlert, setShowAlert] = useState(false);

  const cancelButtonRef = useRef(null);

  const abstractTextRef = useRef(null);
  useEffect(() => {
    if (abstractTextRef && abstractTextRef.current) {
      abstractTextRef.current.style.height = 'auto';
      abstractTextRef.current.style.height = `${
        abstractTextRef.current.scrollHeight + 2
      }px`;
    }
  }, [abstractTextRef, modalFormData, editModeEnabled]);

  const handleChange = (e, name) => {
    setModalFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const handleCloseModal = () => {
    setEditModeEnabled(false);
    setOpen(false);
    refetchTopic();
    setModalFormData({
      topicText: '',
      abstractText: '',
    })
  };

  const handleSave = () => {
    setEditModeEnabled(false);
    handleSubmitTopic();
    handleSubmitAbstract();
  };

  const handleSubmitTopic = () => {
    if (modalFormData.topicText === '') return;
    callMutation({ id: topic.id, text: modalFormData.topicText}, topicUpdateData)
  };

  const handleSubmitAbstract = () => {
    if (!topic.abstract || modalFormData.abstractText === '') return;
    callMutation({id: topic.abstract.id, text: modalFormData.abstractText}, abstractUpdateData)
  };

  const [topicUpdateData] = useMutation(UPDATE_TOPIC_TEXT, {
    context: { headers: { authorization: `${process.env.MUTATION_KEY}`, user: userId } },
    ignoreResults: true,
    fetchPolicy: 'no-cache',
    onError: (error) => console.log(error),
    onCompleted: (data) =>
      setModalFormData((prev) => ({
        ...prev,
        topicText: data.updateTopic.text,
      })),
  });

  const [abstractUpdateData] = useMutation(UPDATE_ABSTRACT, {
    context: { headers: { authorization: `${process.env.MUTATION_KEY}`, user: userId } },
    ignoreResults: true,
    fetchPolicy: 'no-cache',
    onError: (error) => console.log(error),
    onCompleted: (data) =>
      setModalFormData((prev) => ({
        ...prev,
        abstractText: data.updateAbstract.text,
      })),
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
                  <div className="mx-auto flex h-20 w-20  bg-white">
                    <img src={curioCircleLogo} />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <BasicAlert
                      showBasicAlert={showAlert}
                      setShowBasicAlert={setShowAlert}
                      text="Saved!"
                    />
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
                          customStyles="w-full rounded-lg outline-none text-white bg-[#4E376A]/75 placeholder-gray-400 hover:border-violet-500 text-sm shadow-inner shadow-lg"
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
                        onChange={(e) => handleChange(e, 'abstractText')}
                        className="w-full rounded-lg outline-none text-white bg-[#4E376A]/75 placeholder-gray-400 hover:border-violet-500 text-sm shadow-lg max-h-[350px] resize-none min-h-[100px] mb-11"
                      />
                    ) : (
                      <Abstract
                        key={`TopicAbstract:${topic?.id}`}
                        topic={topic}
                        refetchTopic={refetchTopic}
                        editModeEnabled={editModeEnabled}
                        setEditModeEnabled={setEditModeEnabled}
                        handleSave={handleSave}
                        displayedAbstract={displayedAbstract}
                        displayedTopic={displayedTopic}
                        userId={userId}
                      />
                    )}
                  </div>
                </div>
                <div className="mt-6 grid grid-flow-row-dense grid-cols-3 gap-3">
                <ExportButton
                  editModeEnabled={editModeEnabled}
                  displayedTopic={displayedTopic}
                  displayedAbstract={displayedAbstract}
                  keywords={topic?.keywords?.map((keyword) => keyword.word)}
                />
                  <ClipboardButton editModeEnabled={editModeEnabled} displayedTopic={displayedTopic} displayedAbstract={displayedAbstract} keywords={topic?.keywords} 
                  />
                  {editModeEnabled ? (
                    <button
                      onClick={() => setEditModeEnabled(false)}
                      data-id="cancel-edit-abstract"
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
                      data-id="back-button-modal"
                      className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4E376A]/75 transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      <XMarkIcon
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
