import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { callMutation } from '../utils/callMutation';
import { CREATE_TOPIC } from '../graphql/mutations';
import { Input } from '.';

const TopicInputForm = ({ userId, refetch }) => {
  const [formData, setFormData] = useState({ text: '' });

  const inputStyles =
    'w-4/5 rounded-lg p-2 outline-none text-white bg-[#4E376A]/75 placeholder-gray-400 border-sm text-sm shadow-inner shadow-lg mt-5 hover:border-violet-500';

  const [topicCreationData, { loading, error }] = useMutation(CREATE_TOPIC, {
    context: { headers: { authorization: `${process.env.MUTATION_KEY}`, user: userId } },
    onCompleted: refetch,
    onError: (error) => console.log(error),
  });

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    if (formData.text === '') return alert('Please input the topic text.');

    setFormData({ text: 'Saved! Write another?' });
    callMutation({ text: formData.text }, topicCreationData)
  };

  return (
    <div className="flex bg-inherit items-center justify-around pl-5 rounded-xl pr-5 md:pr-3 space-y-5">
      <Input
        placeholder="Write your own topic here!"
        name="text"
        value={formData.text}
        type="text"
        handleChange={handleChange}
        customStyles={inputStyles}
      />
      <button
        className="text-[#2D104F] font-bold bg-white rounded-full ml-5 md:ml-0 text-center text-base pr-3 pl-3 pt-1 mb-4 pb-1 mt-3 cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
        onClick={handleSubmit}
      >
        Save
      </button>
    </div>
  );
};

export default TopicInputForm;
