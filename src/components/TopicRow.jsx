import { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

import { BsFillBookmarkPlusFill } from "react-icons/bs";
import { MdBookmarkAdd } from "react-icons/md";

const CREATE_TOPIC = gql`
  mutation CreateTopic($userId: ID!, $text: String!) {
    createTopic(input: { userId: $userId, text: $text }) {
      id
      text
    }
  }
`;

const CREATE_ABSTRACT = gql`
  mutation CreateAbstract($topicId: ID!, $text: String!) {
    createAbstract(input: { topicId: $topicId, text: $text }) {
      id
      text
    }
  }
`;

const TopicRow = ({ topic, userId, i, refetch }) => {
  const [hasBeenSaved, setHasBeenSaved] = useState(false);

  const [abstractMutationData, { error: abstractError }] = useMutation(
    CREATE_ABSTRACT,
    {
      onCompleted: data => console.log(data),
      onError: error => console.log(error)
    }
  );

  const createAbstract = (topicId, text) => {
    const input = { topicId: topicId, text: text };
    abstractMutationData({ variables: input });
  };

  const formatTopic = () => {
    if (topic.charAt(0) === "-") {
      const temp = topic.slice(1, -1);

      return `${i + 1}. ${temp}`;
    } else {
      return topic;
    }
  };

  const formattedTopic = formatTopic();

  const [topicCreationData, { loading, error }] = useMutation(CREATE_TOPIC, {
    onCompleted: refetch,
    onError: error => console.log(error)
  });

  const createTopicMutation = async text => {
    const input = { userId: userId, text: text };

    const newTopic = await topicCreationData({ variables: input });
    return newTopic;
  };

  const handleSaveTopic = async () => {
    const stringified = JSON.stringify(formattedTopic);
    const newTopic = await createTopicMutation(stringified.slice(4, -1));
    setHasBeenSaved(true);

    return newTopic;
  };

  const generateAbstract = async () => {
    let instract;

    const handleResponse = response => {
      instract = response.data.attributes.text.split("\n")[2];
    };

    const url = "https://megaphone-ai-api.herokuapp.com/api/v1/abstracts?";

    const fullUrl = `${url}topic="${formattedTopic}"`;

    const response = await fetch(fullUrl)
      .then(response => response.json())
      .then(response => handleResponse(response))
      .then(error => console.log(error));

    return instract;
  };

  const handleAddTopicToUser = async () => {
    const newTopic = await handleSaveTopic();

    const topicId = newTopic.data.createTopic.id;

    const abstract = await generateAbstract();

    createAbstract(topicId, abstract);
  };

  return (
    <div className="flex flex-row">
      {hasBeenSaved ? (
        <div className="text-purple-300 text-sm border-[1px] border-none outline-none rounded-full pr-5">
          Saved!
        </div>
      ) : (
        <button
          type="button"
          className="text-white text-lg border-[1px] border-none outline-none rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 hover:text-purple-400 pr-5"
          onClick={handleAddTopicToUser}
        >
          <BsFillBookmarkPlusFill />
        </button>
      )}
      <li key={i} className="text-white font-bold">
        {formattedTopic}
      </li>
    </div>
  );
};

export default TopicRow;
