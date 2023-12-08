import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_TOPIC } from '../graphql/queries';
import { DESTROY_TOPIC } from '../graphql/mutations';
import { MdDeleteForever } from 'react-icons/md';
import { RiMailCheckFill } from 'react-icons/ri';
import { TopicCartIcon, UserTopicModal } from '.';
import { callMutation } from '../utils/callMutation';

const UserTopic = ({ topicId, createdAt, submitted, topicText, refetch, userId }) => {
  const [open, setOpen] = useState(false);
  const handleModal = () => setOpen((prev) => !prev);

  const [destroyTopicData, { loading, error }] = useMutation(DESTROY_TOPIC, {
    context: { headers: { authorization: `${process.env.MUTATION_KEY}`, user: userId } },
    onCompleted: refetch,
    onError: (error) => console.log(error),
  });

  const { data: topicData, refetch: refetchTopic, error: topicError } = useQuery(GET_TOPIC, {
    context: { headers: { authorization: `${process.env.QUERY_KEY}`, user: userId } },
    variables: { id: topicId },
    onError: (error) => console.log(error),
  });

  const recentlySaved = () => {
    const createdDate = createdAt ? new Date(createdAt) : null
    const thresholdTime = new Date(Date.now());

    thresholdTime.setMinutes(thresholdTime.getMinutes() - 5);

    return createdDate > thresholdTime;
  };

  return (
    <div className="flex items-center">
      <span
        className={`rounded-full bg-pink-400 h-2 w-2 text-xs mr-2 ${
          recentlySaved() ? '' : 'invisible'
        }`}
      />
      {submitted && (
        <div className="text-blue-500 mr-10 text-xl">
          <RiMailCheckFill />
        </div>
      )}
      <TopicCartIcon topic={topicData?.topic} />
      <button
        type="button"
        className={`text-blue-300 ml-2 text-2xl mr-3 rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 ${
          submitted && 'hidden'
        }`}
        onClick={() => callMutation({id: topicId}, destroyTopicData)}
      >
        <MdDeleteForever />
      </button>
      <UserTopicModal
        key={topicId}
        userId={userId}
        open={open}
        setOpen={setOpen}
        topic={topicData?.topic}
        refetchTopic={refetchTopic}
      />
      <div
        className={`text-white text-lg cursor-grab ${submitted ? "ml-2" : null}`}
        data-id="saved-topic"
        onClick={handleModal}
      >
        {topicText}
      </div>
    </div>
  );
};

export default UserTopic;
