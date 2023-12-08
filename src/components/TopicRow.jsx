import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_TOPIC, CREATE_TOPIC_KEYWORD } from '../graphql/mutations';
import { BsFillBookmarkPlusFill } from 'react-icons/bs';
import { callMutation } from '../utils/callMutation'

const TopicRow = ({ topic, refetch, userId, keywordIds }) => {
  const [hasBeenSaved, setHasBeenSaved] = useState(false);

  const [createTopicKeywordData] = useMutation(CREATE_TOPIC_KEYWORD, {
    context: { headers: { authorization: `${process.env.MUTATION_KEY}` } },
    onError: (error) => console.log(error),
  });

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
    context: { headers: { authorization: `${process.env.MUTATION_KEY}`, user: userId } },
    onError: (error) => console.log(error),
  });

  const handleSaveTopic = async () => {
    const text = JSON.stringify(formattedTopic).slice(1, -1);
    const newTopic = await callMutation({ text }, topicCreationData)
    setHasBeenSaved(true);

    return newTopic;
  };

  const handleAddTopicToUser = async () => {
    const newTopic = await handleSaveTopic();
    refetch();
    const topicId = newTopic?.data.createTopic.id;

    window.dataLayer.push({ event: 'save_topic', topic: newTopic });

    for (const id of keywordIds) {
      callMutation({ keywordId: id, topicId }, createTopicKeywordData);
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
