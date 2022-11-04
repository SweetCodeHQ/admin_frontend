import { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const CREATE_TOPIC = gql`
  mutation CreateTopic($userId: ID!, $text: String!) {
    createTopic(input: { userId: $userId, text: $text }) {
      id
      text
    }
  }
`;

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    name={name}
    type={type}
    value={value}
    onChange={e => handleChange(e, name)}
    className={
      "my-3 w-full rounded-lg p-2 outline-none text-white bg-[#4E376A]/75 placeholder-gray-400 border-sm text-sm shadow-inner shadow-lg w-4/5"
    }
  />
);

const TopicInputForm = ({ userId, refetch }) => {
  const [formData, setFormData] = useState({ text: "" });

  const [topicCreationData, { loading, error }] = useMutation(CREATE_TOPIC, {
    onCompleted: refetch,
    onError: error => console.log(error)
  });

  const createTopicMutation = text => {
    const input = { userId: userId, text: text };

    topicCreationData({ variables: input });
  };

  const handleChange = (e, name) => {
    setFormData(prevState => ({ ...prevState, [name]: e.target.value }));
  };

  const handleSubmit = e => {
    if (formData.text === "") return alert("Please input the topic text.");

    setFormData({ text: "Saved! Replace me to write another topic." });
    createTopicMutation(formData.text);
  };

  return (
    <div className="w-3/5 items-center flex flex-col bg-[#4E376A] rounded-xl">
      <Input
        placeholder="Write your own topic here!"
        name="text"
        value={formData.text}
        type="text"
        handleChange={handleChange}
      />
      <button
        className="text-[#2D104F] font-bold bg-white rounded-full text-center text-lg pr-3 pl-3 mr-3 pt-1 mb-4 pb-1 cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
        onClick={handleSubmit}
      >
        Save
      </button>
    </div>
  );
};

export default TopicInputForm;
