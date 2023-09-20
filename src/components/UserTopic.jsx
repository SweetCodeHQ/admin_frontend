import { useState, useContext } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { TopicCartIcon, UserTopicModal } from "../components";
import { MdDeleteForever } from "react-icons/md";
import { RiMailCheckFill } from "react-icons/ri";

const GET_TOPIC = gql`
  query topic($id: ID!) {
    topic(id: $id) {
      id
      text
      submitted
      contentType
      abstract {
        id
        text
      }
      keywords {
        word
      }
    }
  }
`;

const DESTROY_TOPIC = gql`
  mutation($id: ID!) {
    destroyTopic(input: { id: $id }) {
      id
    }
  }
`;

const UserTopic = ({ topic, refetch, id }) => {
  const [open, setOpen] = useState(false);
  const handleModal = () => setOpen(prev => !prev);

  const [destroyTopicData, { loading, error }] = useMutation(DESTROY_TOPIC, {
    onCompleted: refetch,
    onError: error => console.log(error)
  });

  const destroyTopicMutation = () => {
    const input = { id: topic.id };

    destroyTopicData({ variables: input });
  };

  const { data: topicData, refetch: refetchTopic } = useQuery(GET_TOPIC, {
    variables: { id: topic.id },
    onError: error => console.log(error)
  });

  return (
    <div className="flex items-left items-center">
      {topic.submitted && (
        <div className="text-blue-500 mr-10 text-xl">
          <RiMailCheckFill />
        </div>
      )}
      <TopicCartIcon topic={topic} />
      <button
        type="button"
        className={`text-blue-300 ml-2 text-2xl mr-3 rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 ${topic.submitted &&
          "hidden"}`}
        onClick={destroyTopicMutation}
      >
        <MdDeleteForever />
      </button>
      <UserTopicModal
        key={id}
        open={open}
        setOpen={setOpen}
        topic={topicData?.topic}
        refetchTopic={refetchTopic}
      />
      <div className="text-white text-lg cursor-grab" data-id="saved-topic" onClick={handleModal}>
        {topic.text}
      </div>
    </div>
  );
};

export default UserTopic;
