import { useState, useContext, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    name={name}
    type={type}
    value={value}
    onChange={e => handleChange(e, name)}
    className={
      "my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    }
  />
);

const TopicDashboard = () => {
  const [formData, setFormData] = useState({
    word1: "",
    word2: "",
    word3: "",
    word4: "",
    word5: ""
  });

  const handleChange = (e, name) => {
    setFormData(prevState => ({ ...prevState, [name]: e.target.value }));
  };

  const getTopicSuggestions = formData => {
    const input = formData;
    {
      /*call API method here*/
    }
  };

  const handleSubmit = e => {
    if (!formData.word1 || !formData.word2 || !formData.word3) return;

    getTopicSuggestions(formData);
    setFormData({ word1: "", word2: "", word3: "", word4: "", word5: "" });
  };
  return (
    <div className="flex w-full justify-center items-center 2xl:px20">
      <div className="flex flex-col items-center md:p-12 py-12 px-4 w-full">
        <h3 className="text-white text-3xl text-center my-2">Make Topics</h3>
        <div className="p-5 pt-3 mt-3 sm:w-96 w-full flex flex-col justify-start items-start blue-glassmorphism">
          <Input
            placeholder="Word 1"
            name="word1"
            value={formData.word1}
            type="text"
            handleChange={handleChange}
          />
          <Input
            placeholder="Word 2"
            name="word2"
            value={formData.word2}
            type="text"
            handleChange={handleChange}
          />
          <Input
            placeholder="Word 3"
            name="word3"
            value={formData.word3}
            type="text"
            handleChange={handleChange}
          />
          <Input
            placeholder="Word 4 (optional)"
            name="word4"
            value={formData.word4}
            type="text"
            handleChange={handleChange}
          />
          <Input
            placeholder="Word 5 (optional)"
            name="word5"
            value={formData.word5}
            type="text"
            handleChange={handleChange}
          />
          <div className="h-[1px] w-full bg-gray-400 my-2" />
          <button
            type="button"
            onClick={handleSubmit}
            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-purple-800"
          >
            See My Topic Suggestions
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicDashboard;
