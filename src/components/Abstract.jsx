import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { callMutation } from '../utils/callMutation';
import { CREATE_ABSTRACT, DESTROY_ABSTRACT } from '../graphql/mutations'
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import {
  PencilSquareIcon
} from '@heroicons/react/24/solid';
import { NoAbstract, Tooltip, TopicCartIcon } from '.';

const Abstract = ({
  topic,
  refetchTopic,
  editModeEnabled,
  setEditModeEnabled,
  displayedAbstract,
  displayedTopic,
  handleSave,
  userId
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const generateInstract = async () => {
    let instract;

    const handleResponse = (response) => {
      instract = response.data.attributes.text;
    };

    const url = `${process.env.AI_API_URL}/api/v1/abstracts?`;

    const fullUrl = `${url}topic="${displayedTopic}"`;

    const response = await fetch(fullUrl)
      .then((response) => response.json())
      .then((response) => handleResponse(response))
      .then((error) => console.log(error));

    return instract;
  };

  const [createAbstract, { error: abstractError }] = useMutation(
    CREATE_ABSTRACT,
    {
      context: { headers: { authorization: `${process.env.MUTATION_KEY}`, user: userId } },
      onCompleted: (data) => console.log(data),
      onError: (error) => console.log(error),
    }
  );

  const [destroyAbstract, { error: abstractDestroyError }] = useMutation(
    DESTROY_ABSTRACT,
    {
      context: { headers: { authorization: `${process.env.MUTATION_KEY}`, user: userId } },
      onError: (error) => console.log(error),
      onCompleted: (data) => console.log(data),
    }
  );

  const handleAbstract = async () => {
    setIsLoading(true);
    if(topic.abstract) await callMutation( {id: topic.abstract?.id}, destroyAbstract)

    await processNewAbstract();
    setIsLoading(false);
  };

  const processNewAbstract = async () => {
    const instract = await generateInstract();

    await callMutation({topicId: topic.id, text: instract }, createAbstract)

    await refetchTopic();
  };

  return (
    <>
      <div className="mt-2 bg-[#4E376A]/75 rounded-lg p-2">
        {displayedAbstract && !isLoading ? (
          <p className="text-sm text-white text-justify">{displayedAbstract}</p>
        ) : (
          <NoAbstract
            handleAbstract={handleAbstract}
            isLoading={isLoading}
          />
        )}
      </div>
      <div className="text-white text-sm font-semibold mb-3 mt-1">
        <ul className="flex justify-around">
          {topic?.keywords?.map((word) => (
            <li key={word.word}>{word.word.toUpperCase()}</li>
          ))}
        </ul>
      </div>
      <div className="grid grid-flow-row-dense grid-cols-3 gap-3">
        <button
          type="submit"
          label="aria-hidden"
          onClick={handleAbstract}
          data-id="regenerate-abstract"
          disabled={topic?.submitted || isLoading}
          className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4E376A]/75 ${
            topic?.submitted || !topic?.abstract
              ? 'cursor-not-allowed'
              : 'transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          } ${isLoading ? 'cursor-progress' : null} ${editModeEnabled ? 'invisible' : null}`}
        >
          <Tooltip
            text={
              topic?.submitted ? 'Already submitted' : 'Regenerate Abstract'
            }
          >
            <ArrowPathIcon
              className={`h-6 w-6 ${
                topic?.submitted || !topic?.abstract || editModeEnabled
                  ? 'text-gray-300'
                  : 'text-blue-300'
              } `}
              aria-hidden="true"
            />
          </Tooltip>
        </button>
        {editModeEnabled ? (
          <button
            onClick={handleSave}
            data-id="save-abstract"
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4E376A] transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-blue-300"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditModeEnabled(true)}
            data-id="edit-abstract"
            disabled={topic?.submitted}
            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4E376A] ${
              topic?.submitted
                ? 'cursor-not-allowed'
                : 'transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            }`}
          >
            <PencilSquareIcon
              className={`h-6 w-6 ${
                topic?.submitted ? 'text-gray-300' : 'text-blue-300'
              }`}
              aria-hidden="true"
            />
          </button>
        )}
        <div className={`mx-auto flex h-12 w-12 justify-center items-center rounded-full transition delay-50 ease-in-out cursor-pointer hover:scale-105 hover:-translate-y-1 bg-[#4E376A]/75 ${editModeEnabled ? 'invisible' : null}`}>
            <TopicCartIcon topic={topic} />
        </div> 
      </div>
    </>
  );
};

export default Abstract;
