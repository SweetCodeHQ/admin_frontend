import { useState, useContext, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Loader, TopicRow, UserTopic } from "../components";
import { ImBullhorn } from "react-icons/im";

const GET_PAGINATED_TOPICS = gql`
  query TopicsConnection(
    $userId: ID!
    $after: String
    $before: String
    $last: Int
  ) {
    userTopicsConnection(
      userId: $userId
      after: $after
      before: $before
      last: $last
    ) {
      pageInfo {
        endCursor
        startCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          text
        }
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
      "my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism shadow-inner shadow-lg"
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

  const [previousKeywords, setPreviousKeywords] = useState([]);

  const [freshTopics, setFreshTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userTopicsConnection, setUserTopicsConnection] = useState([]);

  const { data, refetch, fetchMore } = useQuery(GET_PAGINATED_TOPICS, {
    variables: { userId: userId },
    onError: error => console.log(error),
    onCompleted: data => setUserTopicsConnection(data.userTopicsConnection),
    fetchPolicy: "network-first"
  });

  const updateQuery = (prev, { fetchMoreResult }) => {
    return fetchMoreResult.userTopicsConnection.edges.length
      ? fetchMoreResult
      : prev;
  };

  const flipTopicPage = params => {
    fetchMore({
      variables: params,
      updateQuery
    });
  };

  const handleResponse = response => {
    {
      /*Add response in case of dashes and no numbers or bullets*/
    }
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

  const handleChange = (e, name) => {
    setFormData(prevState => ({ ...prevState, [name]: e.target.value }));
  };

  const handleSubmit = e => {
    if (!formData.word1 || !formData.word2 || !formData.word3)
      return alert("Please provide at least three keywords.");

    getTopicSuggestions();
    setIsLoading(true);
    setPreviousKeywords(Object.values(formData));
    setFormData({ word1: "", word2: "", word3: "", word4: "", word5: "" });
  };

  return (
    <div className="w-full justify-center items-center 2xl:px20">
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
            className="text-white w-full shadow-sm shadow-blue-400 mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-purple-800 hover:shadow-sm"
          >
            See My Topic Suggestions
          </button>
        </div>
        <h3 className="text-white text-3xl text-center my-2 pt-10">
          Generated Topics
        </h3>
        <div className="text-white mb-2 blue-glassmorphism">
          <p className="mt-3 mb-3 mr-10 ml-10">You used these keywords: </p>
          <div className="mb-5">
            {previousKeywords.map((keyword, i) => (
              <p className="text-yellow-400 text-center">{keyword} </p>
            ))}
          </div>
        </div>
        <div className="blue-glassmorphism mt-2 w-full">
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
        {userTopicsConnection?.edges?.length != 0 && (
          <>
            <h3 className="text-white text-3xl text-center my-2 pt-10">
              My Saved Topics
            </h3>
            <div className="blue-glassmorphism mt-2 w-full">
              <ul className="p-5 flex flex-col items-left space-y-2 pl-5">
                {userTopicsConnection?.edges?.map((edge, i) => (
                  <UserTopic
                    id={i}
                    key={edge.node.id}
                    topic={edge.node}
                    refetch={refetch}
                  />
                ))}
              </ul>
              <div className="flex justify-between content-end pl-5 pr-5">
                <div className="text-left text-blue-400">
                  {userTopicsConnection?.pageInfo?.hasPreviousPage ? (
                    <p
                      className="hover:text-purple-600 cursor-pointer"
                      onClick={() =>
                        flipTopicPage({
                          last: 10,
                          before: userTopicsConnection.pageInfo.startCursor
                        })
                      }
                    >
                      {"<<<"}
                    </p>
                  ) : (
                    <p></p>
                  )}
                </div>
                <div className="text-blue-300 pb-8">
                  <ImBullhorn />
                </div>
                <div className=" text-blue-400">
                  {userTopicsConnection?.pageInfo?.hasNextPage ? (
                    <p
                      className="hover:text-purple-600 cursor-pointer"
                      onClick={() =>
                        flipTopicPage({
                          after: userTopicsConnection.pageInfo.endCursor
                        })
                      }
                    >
                      {">>>"}
                    </p>
                  ) : (
                    <p></p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopicDashboard;
