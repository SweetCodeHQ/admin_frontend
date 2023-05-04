import { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { NoAbstract, Loader } from "../components";

const CREATE_ABSTRACT = gql`
  mutation CreateAbstract($topicId: ID!, $text: String!) {
    createAbstract(input: { topicId: $topicId, text: $text }) {
      id
      text
    }
  }
`;

const DESTROY_ABSTRACT = gql`
  mutation DestroyAbstract($id: ID!) {
    destroyAbstract(input: { id: $id }) {
      id
    }
  }
`;

const Abstract = ({
  topic,
  refetchTopic,
  editModeEnabled,
  displayedAbstract,
  displayedTopic
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const generateAbstract = async () => {
    let instract;

    const handleResponse = response => {
      instract = response.data.attributes.text.split("\n")[2];
    };

    const url = `${process.env.AI_API_URL}/api/v1/abstracts?`;

    const fullUrl = `${url}topic="${displayedTopic}"`;

    const response = await fetch(fullUrl)
      .then(response => response.json())
      .then(response => handleResponse(response))
      .then(error => console.log(error));

    return instract;
  };

  const [abstractCreationData, { error: abstractError }] = useMutation(
    CREATE_ABSTRACT,
    {
      onCompleted: data => console.log(data),
      onError: error => console.log(error)
    }
  );

  const [abstractDestroyData, { error: abstractDestroyError }] = useMutation(
    DESTROY_ABSTRACT,
    {
      onError: error => console.log(error),
      onCompleted: data => console.log(data)
    }
  );

  const createAbstract = async text => {
    const input = { topicId: topic.id, text: text };

    await abstractCreationData({ variables: input });
  };

  const destroyAbstract = async () => {
    const input = { id: topic.abstract.id };

    const destruction = await abstractDestroyData({ variables: input });
  };

  const handleCreateAbstract = async () => {
    setIsLoading(true);
    await processNewAbstract();
    setIsLoading(false);
  };

  const handleRecreateAbstract = async () => {
    setIsLoading(true);
    await destroyAbstract();
    await processNewAbstract();
    setIsLoading(false);
  };

  const processNewAbstract = async () => {
    const abstract = await generateAbstract();

    const newInstract = await createAbstract(abstract);
    await refetchTopic();
  };

  return (
    <>
      <div className="mt-2 bg-[#4E376A]/75 rounded-lg p-2">
        {displayedAbstract && !isLoading ? (
          <p className="text-sm text-white text-justify">{displayedAbstract}</p>
        ) : (
          <NoAbstract
            handleCreateAbstract={handleCreateAbstract}
            isLoading={isLoading}
          />
        )}
      </div>
      <button
        onClick={handleRecreateAbstract}
        disabled={topic?.submitted || isLoading}
        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4E376A]/75 ${
          topic?.submitted || !topic?.abstract || editModeEnabled
            ? "cursor-not-allowed"
            : "transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        } ${isLoading ? "cursor-progress" : null} mt-2`}
      >
        <ArrowPathIcon
          className={`h-6 w-6 ${
            topic?.submitted || !topic?.abstract || editModeEnabled
              ? "text-gray-300"
              : "text-blue-300"
          } `}
          aria-hidden="true"
        />
      </button>
    </>
  );
};

export default Abstract;