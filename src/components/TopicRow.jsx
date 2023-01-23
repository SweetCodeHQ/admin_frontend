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

const TopicRow = ({ topic, userId, i, refetch }) => {
  const [hasBeenSaved, setHasBeenSaved] = useState(false);

  const formatTopic = () => {
    if (topic.charAt(0) === "-") {
      const temp = topic.substring(1);

      return `${temp}`;
    } else {
      const temp = topic.substring(3);
      return temp;
    }
  };

  const formattedTopic = formatTopic();

  const [topicCreationData, { loading, error }] = useMutation(CREATE_TOPIC, {
    onCompleted: data => console.log(data),
    onError: error => console.log(error)
  });

  const createTopicMutation = async text => {
    const input = { userId: userId, text: text };

    const newTopic = await topicCreationData({ variables: input });
    return newTopic;
  };

  const handleSaveTopic = async () => {
    const stringified = JSON.stringify(formattedTopic);
    const newTopic = await createTopicMutation(stringified.slice(1, -1));
    setHasBeenSaved(true);

    return newTopic;
  };

  const handleAddTopicToUser = async () => {
    const newTopic = await handleSaveTopic();
    refetch();
    const topicId = newTopic.data.createTopic.id;
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
