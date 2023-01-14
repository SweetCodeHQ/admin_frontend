import { useState, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { EditTopicMenu, TopicCartIcon, TopicAbstractMenu } from "../components";
import { CartContext } from "../context/CartContext";

import { MdDeleteForever } from "react-icons/md";
import { HiPencilAlt } from "react-icons/hi";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { RiMailCheckFill } from "react-icons/ri";

const DESTROY_TOPIC = gql`
  mutation($id: ID!) {
    destroyTopic(input: { id: $id }) {
      id
    }
  }
`;

const UserTopic = ({ topic, refetch, id }) => {
  const [clickedEdit, setClickedEdit] = useState(false);
  {
    /*State is getting complex...use the reduceState hook instead*/
  }
  const [toggleAbstract, setToggleAbstract] = useState(false);

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

  const handleToggleAbstract = e => {
    setToggleAbstract(prev => !prev);
  };

  return (
    <>
      {clickedEdit ? (
        <EditTopicMenu topic={topic} setClickedEdit={setClickedEdit} />
      ) : (
        <div className="flex items-left">
          {topic.submitted && (
            <div className="text-blue-500 mr-10">
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
            className={`text-blue-300 mr-3 rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 ${topic.submitted &&
              "hidden"}`}
            onClick={destroyTopicMutation}
          >
            <MdDeleteForever />
          </button>
          <button
            className={`text-blue-300 mr-3 rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 ${topic.submitted &&
              "hidden"}`}
            type="button"
            onClick={() => setClickedEdit(true)}
          >
            <HiPencilAlt />
          </button>
          <button
            className={`mr-3 rounded-full cursor-pointer transition delay-50 ease-in-out  ${
              toggleAbstract
                ? "scale-150 text-blue-500"
                : "hover:scale-105 hover:-translate-y-1 text-blue-300"
            }`}
          >
            <IoIosArrowDropdownCircle onClick={e => handleToggleAbstract()} />
          </button>
          <li className="text-white font-bold">{topic.text}</li>
        </div>
      )}
      {toggleAbstract && (
        <TopicAbstractMenu
          topic={topic}
          refetch={refetch}
          handleToggleAbstract={handleToggleAbstract}
        />
      )}
    </>
  );
};

export default UserTopic;
