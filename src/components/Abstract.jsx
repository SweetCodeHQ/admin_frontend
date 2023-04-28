import { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { NoAbstract } from "../components";

const CREATE_ABSTRACT = gql`
  mutation CreateAbstract($topicId: ID!, $text: String!) {
    createAbstract(input: { topicId: $topicId, text: $text }) {
      id
      text
    }
  }
`;

const Abstract = ({ topic, refetchTopic, editModeEnabled }) => {
  // Abstract exists
  // -Editable in edit mode (shows Input)
  //
  //
  // Abstract does not exist
  // -Add a regenerate button in editable mode where the Google Doc button is.

  const [isLoading, setIsLoading] = useState(false);

  const generateAbstract = async () => {
    let instract;

    const handleResponse = response => {
      instract = response.data.attributes.text.split("\n")[2];
    };

    const url = `${process.env.AI_API_URL}/api/v1/abstracts?`;

    const fullUrl = `${url}topic="${topic.text}"`;

    const response = await fetch(fullUrl)
      .then(response => response.json())
      .then(response => handleResponse(response))
      .then(error => console.log(error));

    return instract;
  };

  const [abstractMutationData, { error: abstractError }] = useMutation(
    CREATE_ABSTRACT,
    {
      onCompleted: data => console.log(data),
      onError: error => console.log(error)
    }
  );

  const createAbstract = async text => {
    const input = { topicId: topic.id, text: text };

    await abstractMutationData({ variables: input });
  };

  const handleCreateAbstract = async () => {
    setIsLoading(true);
    const abstract = await generateAbstract();

    const newInstract = await createAbstract(abstract);
    await refetchTopic();
    setIsLoading(false);
  };

  return (
    <>
      <div className="mt-2 bg-[#4E376A]/75 rounded-lg p-2">
        {topic?.abstract ? (
          <p className="text-sm text-white text-justify">
            {topic?.abstract?.text}
          </p>
        ) : (
          <NoAbstract
            handleCreateAbstract={handleCreateAbstract}
            isLoading={isLoading}
          />
        )}
      </div>
      <button
        disabled={topic?.submitted}
        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#4E376A]/75 ${editModeEnabled &&
          "invisible"}
        } ${
          topic?.submitted
            ? "cursor-not-allowed"
            : "transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        } mt-2`}
      >
        <ArrowPathIcon
          className={`h-6 w-6 ${
            topic?.submitted ? "text-gray-300" : "text-blue-300"
          }`}
          aria-hidden="true"
        />
      </button>
    </>
  );
};

export default Abstract;
