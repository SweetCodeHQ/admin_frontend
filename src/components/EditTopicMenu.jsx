import { useState, useRef, useEffect, forwardRef } from "react";
import { gql, useMutation } from "@apollo/client";
import { HiPencilAlt, HiOutlineX } from "react-icons/hi";

const UPDATE_TOPIC = gql`
  mutation UpdateTopicText($id: ID!, $text: String!) {
    updateTopic(input: { id: $id, text: $text }) {
      id
      text
    }
  }
`;

const Input = forwardRef(
  ({ placeholder, name, type, value, handleChange }, topicInputRef) => (
    <input
      ref={topicInputRef}
      placeholder={placeholder}
      name={name}
      type={type}
      value={value}
      onChange={e => handleChange(e, name)}
      className={
        "my-2 w-full rounded-sm p-2 outline-none bg-transparent text-blue-200 border-none text-base font-bold white-glassmorphism bg-[#4E376A]/75 rounded-lg"
      }
    />
  )
);

const EditTopicMenu = ({ topic, handleToggleEditMenu, topicRef, refetch }) => {
  const [topicText, setTopicText] = useState(topic.text);

  const [topicFormData, setTopicFormData] = useState({
    text: topic.text,
    id: topic.id
  });

  const topicInputRef = useRef();
  // useEffect(() => {
  //   setFormText(abstract?.text);
  // }, [abstract]);

  const editTopic = updateInfo => {
    const input = topicFormData;
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
  };

  const handleUpdateTopic = () => {
    if (topicFormData.text && topicFormData.text !== topicText) {
      editTopic();
      setTopicText(prev => topicFormData.text);
      // refetch();
    }
  };

  useEffect(() => {
    const handleClick = event => {
      if (
        topicInputRef.current &&
        !topicInputRef.current.contains(event.target)
      ) {
        handleUpdateTopic();
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [topicInputRef, topicFormData, topicText]);

  return (
    <div className="flex items-center" ref={topicRef}>
      <Input
        ref={topicInputRef}
        placeholder="Abstract Text"
        name="text"
        type="text"
        value={topicFormData.text}
        handleChange={handleChange}
      />
    </div>
  );
};

export default EditTopicMenu;
