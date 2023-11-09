import { useState, useContext } from 'react';
import { gql, useMutation } from '@apollo/client';
import { BsFillBookmarkPlusFill } from 'react-icons/bs';
import { UserContext } from '../context';

const CREATE_TOPIC = gql`
  mutation CreateTopic($userId: ID!, $text: String!) {
    createTopic(input: { userId: $userId, text: $text }) {
      id
      text
    }
  }
`;

const CREATE_TOPIC_KEYWORD = gql`
  mutation CreateTopicKeyword($topicId: ID!, $keywordId: ID!) {
    createTopicKeyword(input: { topicId: $topicId, keywordId: $keywordId }) {
      id
    }
  }
`;

const TopicRow = ({ topic, i, refetch, keywordIds }) => {
  const [hasBeenSaved, setHasBeenSaved] = useState(false);

  const { megaphoneUserInfo } = useContext(UserContext);

  const [createTopicKeywordData] = useMutation(CREATE_TOPIC_KEYWORD, {
    context: { headers: { authorization: `${process.env.MUTATION_KEY}` } },
    onCompleted: (data) => console.log(data),
    onError: (error) => console.log(error),
  });

  const createTopicKeyword = (keywordId, topicId) => {
    const input = { topicId, keywordId };
    createTopicKeywordData({ variables: input });
  };

  const formatTopic = () => {
    if (topic.charAt(0) === '-') {
      const temp = topic.substring(1);

      return `${temp}`;
    }
    const temp = topic.substring(3);
    return temp;
  };

  const formattedTopic = formatTopic();

  const [topicCreationData, { loading, error }] = useMutation(CREATE_TOPIC, {
    context: { headers: { authorization: `${process.env.MUTATION_KEY}` } },
    onCompleted: (data) => console.log(data),
    onError: (error) => console.log(error),
  });

  const createTopicMutation = async (text) => {
    const input = { userId: megaphoneUserInfo.id, text };

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
    const topicId = newTopic?.data.createTopic.id;

    window.dataLayer.push({ event: 'save_topic', topic: newTopic });

    for (const id of keywordIds) {
      createTopicKeyword(id, topicId);
    }
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
          data-id="save-topic"
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
