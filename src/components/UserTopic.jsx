import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { MdDeleteForever } from "react-icons/md";
import { HiPencilAlt, HiOutlineX } from "react-icons/hi";

const UPDATE_TOPIC = gql`
  mutation($id: ID!, $text: String!) {
    updateTopic(input: { id: $id, text: $text }) {
      id
      text
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
{
  /*Consider pulling this out into a separate file because you use it in so many places.*/
}
const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    name={name}
    type={type}
    value={value}
    onChange={e => handleChange(e, name)}
    className={
      "my-2 w-full rounded-sm p-2 outline-none bg-transparent text-blue-200 border-none text-sm white-glassmorphism"
    }
  />
);

const UserTopic = ({ topic, refetch, id }) => {
  const [clicked, setClicked] = useState(false);

  const [topicFormData, setTopicFormData] = useState({
    text: topic.text,
    id: topic.id
  });

  const [destroyTopicData, { loading, error }] = useMutation(DESTROY_TOPIC, {
    onCompleted: refetch,
    onError: error => console.log(error)
  });

  const destroyTopicMutation = () => {
    const input = { id: topic.id };

    destroyTopicData({ variables: input });
  };

  const editTopic = updateInfo => {
    const input = updateInfo;
    topicUpdateData({ variables: input });
  };

  const [
    topicUpdateData,
    { loading: updateLoading, error: updateError }
  ] = useMutation(UPDATE_TOPIC, {
    onError: error => console.log(error),
    onCompleted: data => console.log(data)
  });

  const handleChange = (e, name) => {
    setTopicFormData(prevState => ({ ...prevState, [name]: e.target.value }));
  };

  const handleSubmit = e => {
    const { text } = topicFormData;

    if (!text) return;

    editTopic(topicFormData);
    setClicked(false);
  };

  return (
    <>
      {clicked ? (
        <div className="flex items-center">
          <div className="self-start">
            <button
              type="button"
              className="text-blue-300 mr-3 border-[1px] border-[#3d4f7c] rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 hover:text-purple-500"
              onClick={() => {
                setClicked(false);
              }}
            >
              <HiOutlineX />
            </button>
          </div>
          <Input
            placeholder={topic.text}
            name="text"
            value={topicFormData.text}
            type="text"
            handleChange={handleChange}
          />
          <div>
            <button
              className="border-none ml-3 text-blue-200 bg-blue-500 text-sm font-bold italic p-1 border-[1px] border-[#3d4f7c] rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-purple-700"
              onClick={handleSubmit}
            >
              Update
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-left">
          <button
            type="button"
            className="text-blue-300 mr-3 rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 hover:text-purple-500"
            onClick={destroyTopicMutation}
          >
            <MdDeleteForever />
          </button>
          <button
            className="text-blue-300 mr-3 rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 hover:text-purple-500"
            type="button"
            onClick={() => setClicked(true)}
          >
            <HiPencilAlt />
          </button>
          <li className="text-white">{topic.text}</li>
        </div>
      )}
    </>
  );
};

export default UserTopic;
