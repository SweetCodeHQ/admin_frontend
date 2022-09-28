import { useState, useContext, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Loader, TopicRow } from "../components";

const GET_USER_TOPICS = gql`
  query UserTopics($email: String!) {
    user(email: $email) {
      topics {
        id
        text
      }
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
      "my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    }
  />
);
{
  /*Consider pulling form into its own component so that the Topic Dashboard doesn't re-render everytime someone types a character*/
}
const TopicDashboard = ({ userId, userEmail }) => {
  const [formData, setFormData] = useState({
    word1: "",
    word2: "",
    word3: "",
    word4: "",
    word5: ""
  });

  const [freshTopics, setFreshTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userTopics, setUserTopics] = useState([]);

  const { data, error, loading, refetch } = useQuery(GET_USER_TOPICS, {
    variables: { email: userEmail },
    onError: error => console.log(error),
    onCompleted: data => setUserTopics(data.user.topics)
  });

  const handleChange = (e, name) => {
    setFormData(prevState => ({ ...prevState, [name]: e.target.value }));
  };

  const handleResponse = response => {
    const topics = response.data.attributes.text;
    const formattedTopics = topics.split("\n").splice(2, 5);

    setIsLoading(false);
    setFreshTopics(formattedTopics);
  };

  const getTopicSuggestions = () => {
    const url = "https://megaphone-ai-api.herokuapp.com/api/v1/topics?";

    const fullUrl = `${url}keywords="${formData.word1} ${formData.word2} ${formData.word3} ${formData.word4} ${formData.word5}"`;

    fetch(fullUrl)
      .then(response => response.json())
      .then(response => handleResponse(response))
      .then(error => console.log(error));
  };

  const handleSubmit = e => {
    if (!formData.word1 || !formData.word2 || !formData.word3) return;

    getTopicSuggestions();
    setIsLoading(true);
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
        <h3 className="text-white text-3xl text-center my-2 pt-10">
          Generated Topics
        </h3>
        <div className="blue-glassmorphism mt-5 w-full">
          {isLoading ? (
            <Loader />
          ) : (
            <ul className="p-5 flex flex-col items-left space-y-2 pl-5">
              {freshTopics.length != 0 ? (
                freshTopics.map((topic, i) => (
                  <TopicRow
                    topic={topic}
                    key={i}
                    userId={userId}
                    i={i}
                    refetch={refetch}
                  />
                ))
              ) : (
                <h1 className="text-purple-400/70 text-center text-xl animate-pulse">
                  Make Topics Using Our Generator
                </h1>
              )}
            </ul>
          )}
        </div>
        <h3 className="text-white text-3xl text-center my-2 pt-10">
          My Saved Topics
        </h3>
        <div className="blue-glassmorphism mt-5 w-full">
          <ul className="p-5 flex flex-col items-left space-y-2 pl-5">
            {userTopics.map((topic, i) => (
              <li className="text-white" key={i}>
                {topic.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopicDashboard;
