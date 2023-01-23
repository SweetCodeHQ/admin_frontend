import { useState, useContext, useRef, useEffect, forwardRef } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
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
  const [toggleEditMenu, setToggleEditMenu] = useState(false);
  const [toggleAbstract, setToggleAbstract] = useState(false);

  const userTopicRef = useRef();
  const abstractRef = useRef();
  const topicRef = useRef();
  {
    /*State is getting complex...use the reduceState hook instead*/
  }

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

  const handleToggleAbstract = currentlyOpen => {
    setToggleAbstract(prev => !currentlyOpen);
  };

  const handleToggleEditMenu = currentlyOpen => {
    setToggleEditMenu(prev => !currentlyOpen);
  };

  const handleToggleSubmenus = currentlyOpen => {
    handleToggleAbstract(currentlyOpen);
    handleToggleEditMenu(currentlyOpen);
  };

  useEffect(() => {
    const handleClick = event => {
      if (
        userTopicRef.current &&
        !userTopicRef.current.contains(event.target)
      ) {
        setTimeout(() => {
          handleToggleSubmenus(true);
        }, 100);
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [userTopicRef, toggleAbstract, toggleEditMenu]);

  return (
    <div ref={userTopicRef}>
      {toggleEditMenu ? (
        <EditTopicMenu
          topic={topic}
          handleToggleEditMenu={handleToggleEditMenu}
          refetch={refetch}
        />
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
            className={`text-blue-300 text-xl mr-3 rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 ${topic.submitted &&
              "hidden"}`}
            onClick={destroyTopicMutation}
          >
            <MdDeleteForever />
          </button>
          <div
            className={`text-white text-lg cursor-grab ${
              toggleAbstract ? "font-bold text-lg" : "text-base"
            }`}
            onClick={e => handleToggleSubmenus(false)}
          >
            {topic.text}
          </div>
        </div>
      )}
      {toggleAbstract && (
        <TopicAbstractMenu
          ref={abstractRef}
          topic={topic}
          handleToggleAbstract={handleToggleAbstract}
        />
      )}
    </div>
  );
};

export default UserTopic;
