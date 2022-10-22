import { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

import { BsFillBookmarkFill } from "react-icons/bs";

const CREATE_TOPIC = gql`
  mutation CreateTopic($userId: ID!, $text: String!) {
    createTopic(input: { userId: $userId, text: $text }) {
      id
      text
    }
  }
`;

const TopicRow = ({ topic, userId, i, refetch }) => {
  const [hasBeenSaved, setHasBeenSaved] = useState(false);

  const [topicCreationData, { loading, error }] = useMutation(CREATE_TOPIC, {
    onCompleted: refetch,
    onError: error => console.log(error)
  });

  const createTopicMutation = text => {
    const input = { userId: userId, text: text };

    topicCreationData({ variables: input });
  };

  const handleSaveTopic = () => {
    const stringified = JSON.stringify(topic);
    createTopicMutation(stringified.slice(4, -1));
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
          className="text-white text-sm border-[1px] border-none outline-none rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 hover:text-purple-400 pr-5"
          onClick={handleSaveTopic}
        >
          <BsFillBookmarkFill />
        </button>
      )}
      <li key={i} className="text-white font-bold">
        {topic}
      </li>
    </div>
  );
};

export default TopicRow;
