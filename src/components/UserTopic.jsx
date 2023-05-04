import { useState, useContext } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { TopicCartIcon, UserTopicModal } from "../components";
import { CartContext } from "../context/CartContext";

import { MdDeleteForever } from "react-icons/md";
import { HiPencilAlt } from "react-icons/hi";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { RiMailCheckFill } from "react-icons/ri";

const GET_TOPIC = gql`
  query topic($id: ID!) {
    topic(id: $id) {
      id
      text
      submitted
      abstract {
        id
        text
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

  const { handleAddToCart, cartTopics } = useContext(CartContext);

  const cartIds = cartTopics?.map(topic => topic.id);

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
      <TopicCartIcon
        topic={topic}
        handleAddToCart={handleAddToCart}
        cartIds={cartIds}
      />
      <button
        type="button"
        className={`text-blue-300 text-xl mr-3 rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 ${topic.submitted &&
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
      <div className="text-white text-lg cursor-grab" onClick={handleModal}>
        {topic.text}
      </div>
    </div>
  );
};

export default UserTopic;
