import { useState, useContext, useEffect } from "react";
import { CartContext, CartContextProvider } from "../context/CartContext";
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

const GET_RANDOM_KEYWORDS = gql`
  query RandomKeywords {
    randomKeywords {
      word
    }
  }
`;

const GET_TOP_FIVE_KEYWORDS = gql`
  query Top5 {
    topFiveKeywords {
      word
    }
  }
`;

const CREATE_KEYWORD = gql`
  mutation CreateKeyword($word: String!) {
    createKeyword(input: { word: $word }) {
      id
      word
    }
  }
`;

const UPDATE_KEYWORD = gql`
  mutation UpdateKeyword($word: String!) {
    updateKeyword(input: { word: $word }) {
      id
      word
    }
  }
`;

const CREATE_USER_KEYWORD = gql`
  mutation CreateUserKeyword($userId: ID!, $word: String!) {
    createUserKeyword(input: { userId: $userId, word: $word }) {
      id
    }
  }
`;

{
  /*
  Add user-keyword mutation and random keywords as suggestions
  */
}
const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    name={name}
    type={type}
    value={value}
    onChange={e => handleChange(e, name)}
    className={
      "my-2 w-full rounded-lg p-2 outline-none text-white bg-[#4E376A]/75 placeholder-gray-400 border-none text-sm shadow-inner shadow-lg"
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

  const [inputKeywords, setInputKeywords] = useState(null);

  const [freshTopics, setFreshTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userTopicsConnection, setUserTopicsConnection] = useState([]);

  const handleAddToCart = useContext(CartContext);

  const { data, refetch, fetchMore } = useQuery(GET_PAGINATED_TOPICS, {
    variables: { userId: userId },
    onError: error => console.log(error),
    onCompleted: data => setUserTopicsConnection(data.userTopicsConnection),
    fetchPolicy: "network-first"
  });

  const { data: randomKeywordsData, refetch: refetchRandomKeywords } = useQuery(
    GET_RANDOM_KEYWORDS,
    {
      onError: error => console.log(error)
    }
  );

  const { data: topFiveKeywordsData } = useQuery(GET_TOP_FIVE_KEYWORDS, {
    onError: error => console.log(error)
  });

  const [keywordMutationData] = useMutation(CREATE_KEYWORD, {
    onCompleted: data => console.log(data),
    onError: error => console.log(error)
  });

  const createKeyword = keyword => {
    const input = { word: keyword };
    keywordMutationData({ variables: input });
  };

  const [updateKeywordData] = useMutation(UPDATE_KEYWORD, {
    onCompleted: data => console.log(data),
    onError: error => console.log(error)
  });

  const updateKeyword = keyword => {
    const input = { word: keyword };
    updateKeywordData({ variables: input });
  };

  const [userKeywordMutationData] = useMutation(CREATE_USER_KEYWORD, {
    onCompleted: data => console.log(data),
    onError: error => console.log(error)
  });

  const createUserKeyword = word => {
    const input = { userId: userId, word: word };
    userKeywordMutationData({ variables: input });
  };

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
    {
      /*Add something that normalizes the formatting here for words--remove spaces, downcase*/
    }
    const words = Object.values(formData);

    getTopicSuggestions();
    setIsLoading(true);
    setInputKeywords(words);
    setFormData({ word1: "", word2: "", word3: "", word4: "", word5: "" });

    keywordActions(words);
  };

  const handleSuggest = e => {
    const words = randomKeywordsData.randomKeywords;

    setFormData({
      word1: words[0].word,
      word2: words[1].word,
      word3: words[2].word,
      word4: words[3].word,
      word5: words[4].word
    });
    refetchRandomKeywords();
  };

  const keywordActions = async words => {
    for (const word of words) {
      await createKeyword(word);
      await createUserKeyword(word);
      await updateKeyword(word);
    }
  };

  const moveKeyword = (word, i) => {
    let newForm;
    if (formData.word1 === "") {
      newForm = {
        ...formData,
        word1: word
      };
    } else if (formData.word2 === "") {
      newForm = {
        ...formData,
        word2: word
      };
    } else if (formData.word3 === "") {
      newForm = {
        ...formData,
        word3: word
      };
    } else if (formData.word4 === "") {
      newForm = {
        ...formData,
        word4: word
      };
    } else if (formData.word5 === "") {
      newForm = {
        ...formData,
        word5: word
      };
    } else {
      newForm = {
        ...formData,
        word5: word
      };
    }

    setFormData(newForm);
  };

  return (
    <div className="w-full justify-center items-center 2xl:px20">
      <div className="flex w-full flex-col items-center mt-5">
        <div className="flex w-full justify-between">
          <div className="w-full flex flex-col justify-items-center">
            <h3 className="text-white text-3xl font-bold text-center">
              Make Topics
            </h3>
            <div className="p-5 pt-3 mt-3 w-4/5 flex flex-col justify-start items-start bg-[#3A1F5C] rounded-xl self-center">
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
              <div className="flex w-full justify-around flex-wrap">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-[#2D104F] bg-white pr-5 pl-5 p-2 mt-2 font-bold rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
                >
                  Generate
                </button>
                <button
                  type="button"
                  onClick={handleSuggest}
                  className="text-[#2D104F] bg-white pr-5 pl-5 p-2 mt-2 font-bold rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
                >
                  Autofill
                </button>
              </div>
            </div>
            <div className="flex flex-col mt-2 w-full">
              <h2 className="text-white font-bold self-center text-lg">
                Trending Keywords
              </h2>
              <div className="flex flex-wrap justify-evenly w-full self-center">
                {topFiveKeywordsData?.topFiveKeywords.map((keyword, i) => (
                  <div
                    className="text-[#2D104F] font-bold bg-white rounded-full text-center text-sm pr-3 pl-3 mt-2 mr-3 pt-1 pb-1 cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
                    key={i}
                    onClick={() => moveKeyword(keyword.word, i)}
                  >
                    {keyword.word}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex items-center justify-between w-full mt-5">
              <h3 className="text-white text-3xl font-bold text-center my-2">
                Generated Topics
              </h3>
            </div>
            <div className="bg-[#4E376A] rounded-xl mt-2 w-full">
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
                    <h1 className="text-purple-400/70 text-center text-xl">
                      Make Topics Using Our Generator
                    </h1>
                  )}
                </ul>
              )}
            </div>
            {inputKeywords && (
              <ul className="flex flex-wrap justify-between w-full">
                {inputKeywords.map(
                  (keyword, i) =>
                    keyword != "" && (
                      <li className="text-[#2D104F] font-bold bg-white text-sm rounded-full text-center pr-5 pl-5 mt-2 mr-3 pt-2 pb-2">
                        {keyword}
                      </li>
                    )
                )}
              </ul>
            )}
          </div>
        </div>
        {userTopicsConnection?.edges?.length != 0 && (
          <>
            <h3 className="text-white text-3xl text-center my-2 pt-10">
              My Saved Topics
            </h3>
            <div className="bg-[#4E376A] rounded-xl mt-2 w-full">
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
