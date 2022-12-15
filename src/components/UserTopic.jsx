import { useState, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { EditTopicMenu, TopicCartIcon } from "../Components";
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
          <button className="text-blue-300 mr-3 rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105">
            <IoIosArrowDropdownCircle onClick={e => handleToggleAbstract()} />
          </button>
          <li className="text-white font-bold">{topic.text}</li>
        </div>
      )}
      {toggleAbstract && (
        <div className="flex flex-col text-white opacity-70">
          <h3 className="text-sm self-center border rounded-xl p-2 mb-3">
            BETA FEATURE
          </h3>
          <h1 className="self-center">Abstract</h1>
          <div className="self-center max-w-prose">{topic.abstract.text}</div>
        </div>
      )}
    </>
  );
};

export default UserTopic;
