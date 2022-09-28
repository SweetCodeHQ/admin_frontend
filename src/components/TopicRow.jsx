import { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const CREATE_TOPIC = gql`
  mutation CreateTopic($userId: ID!, $text: String!) {
    createTopic(input: { userId: $userId, text: $text }) {
      id
      text
    }
  }
`;

const TopicRow = ({ topic, userId, i }) => {
  const [hasBeenSaved, setHasBeenSaved] = useState(false);

  const [topicCreationData, { loading, error }] = useMutation(CREATE_TOPIC, {
    onCompleted: data => console.log(data),
    onError: error => console.log(error)
  });

  const createTopicMutation = text => {
    const input = { userId: userId, text: text };

    topicCreationData({ variables: input });
  };

  const handleSaveTopic = () => {
    const stringified = JSON.stringify(topic);
    createTopicMutation(stringified.slice(4));
    setHasBeenSaved(true);
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
          className="text-blue-300 text-sm border-[1px] border-none outline-none rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 hover:text-purple-400 pr-5"
          onClick={handleSaveTopic}
        >
          Save
        </button>
      )}
      <li key={i} className="text-white">
        {topic}
      </li>
    </div>
  );
};

export default TopicRow;
