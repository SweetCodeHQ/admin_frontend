import { useState, useContext, useEffect } from "react";
import { CartContext, CartContextProvider } from "../context/CartContext";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill
} from "react-icons/bs";
import { gql, useQuery, useMutation } from "@apollo/client";

import {
  Button,
  Input,
  Loader,
  TopicRow,
  UserTopic,
  TopicInputForm,
  TopicFilter
} from "../components";
import { ImBullhorn } from "react-icons/im";
import { INDUSTRIES } from "../constants/industries";
import { filterBySubmitted, filterByNotSubmitted } from "../constants/filters";

const GET_USER_TOPICS = gql`
  query User($email: String!) {
    user(email: $email) {
      topics {
        id
        text
        submitted
      }
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

const UPDATE_CLICKED_GENERATE_COUNT = gql`
  mutation UpdateClickedGenerateCount($id: ID!) {
    updateUser(input: { id: $id, clickedGenerateCount: 1 }) {
      id
      clickedGenerateCount
    }
  }
`;

export const IndustrySwitch = ({ toggleUseIndustry, setToggleUseIndustry }) => {
  const enabledClass = "transform translate-x-5 bg-purple-500";

  const flipStatus = () => {
    setToggleUseIndustry(prev => !prev);
  };

  return (
    <>
      <div
        className="md:w-10 md:h-4 w-10 h-3 flex items-center white-glassmorphism rounded-full p-1 cursor-pointer"
        onClick={() => {
          flipStatus();
        }}
      >
        <div
          className={
            "white-glassmorphism md:w-3 md:h-3 h-2 w-2 rounded-full shadow-md transform duration-300 ease-in-out" +
            (toggleUseIndustry ? enabledClass : null)
          }
        ></div>
      </div>
    </>
  );
};

const TopicDashboard = ({ megaphoneUserInfo, refetchUser }) => {
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

  const [userTopics, setUserTopics] = useState([]);
  const [topicPages, setTopicPages] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);

  const calculateCurrentPage = () => {
    setCurrentPage(0);
  };

  const numOfPages = topicPages.length;

  const backArrowVisible = () => {
    return currentPage !== 0;
  };

  const forwardArrowVisible = () => {
    if (numOfPages === 1) return false;
    return currentPage + 1 !== numOfPages;
  };

  const [userTopicsConnection, setUserTopicsConnection] = useState([]);

  const [toggleUseIndustry, setToggleUseIndustry] = useState(true);

  const [filterTopicsBy, setFilterTopicsBy] = useState("ALL");

  const filterTopics = () => {
    if (filterTopicsBy === "ALL") {
      return userTopics;
    } else if (filterTopicsBy === "SUBMITTED") {
      return filterBySubmitted(userTopics);
    } else if (filterTopicsBy === "NOT SUBMITTED") {
      return filterByNotSubmitted(userTopics);
    }
  };

  useEffect(() => {
    handleTopicDisplay();
    calculateCurrentPage();
  }, [userTopics, filterTopicsBy]);

  const handleTopicDisplay = () => {
    const filteredTopics = filterTopics();
    paginateTopics(filteredTopics);
  };

  const paginateTopics = topics => {
    if (topics.length > 10) {
      let topicsArr = [...topics];
      let pages = [];
      while (topicsArr.length > 0) {
        let page = topicsArr.splice(0, 10);
        pages.push(page);
      }
      setTopicPages(prev => pages);
    } else {
      setTopicPages(prev => [topics]);
    }
  };

  const flipTopicPageForward = direction => {
    if (direction) return setCurrentPage(prev => (prev += 1));
    if (!direction) return setCurrentPage(prev => (prev -= 1));
  };

  const handleAddToCart = useContext(CartContext);

  const { data: userTopicsData, refetch: refetchUserTopics } = useQuery(
    GET_USER_TOPICS,
    {
      variables: { email: megaphoneUserInfo?.email },
      onError: error => console.log(error),
      onCompleted: data => setUserTopics(data.user.topics),
      fetchPolicy: "network-first"
    }
  );

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
    const input = { userId: megaphoneUserInfo.id, word: word };
    userKeywordMutationData({ variables: input });
  };

  const updateQuery = (prev, { fetchMoreResult }) => {
    return fetchMoreResult.userTopicsConnection.edges.length
      ? fetchMoreResult
      : prev;
  };

  const updateClickedGenerateCount = id => {
    const input = { id: id };
    updateClickedGenerateMutationData({ variables: input });
  };
  {
    /*Pull this back into the userContext*/
  }
  const [
    updateClickedGenerateMutationData,
    { loading: loginLoading, error: loginError }
  ] = useMutation(UPDATE_CLICKED_GENERATE_COUNT, {
    onCompleted: data => console.log(data),
    onError: error => console.log(error)
  });

  const handleTopicResponse = response => {
    {
      /*Add response in case of dashes and no numbers or bullets*/
    }
    const topics = response.data.attributes.text;
    const formattedTopics = topics.split("\n").splice(2, 5);

    setIsLoading(false);
    setFreshTopics(formattedTopics);
  };

  const getTopicSuggestions = () => {
    const url = `${process.env.AI_API_URL}/api/v1/topics?`;

    const fullUrl = `${url}keywords="${formData.word1} ${formData.word2} ${formData.word3} ${formData.word4} ${formData.word5}"`;

    fetch(fullUrl)
      .then(response => response.json())
      .then(response => handleTopicResponse(response))
      .then(error => console.log(error));
  };

  useEffect(() => {
    getKeywordSuggestions();
  }, [toggleUseIndustry]);

  const [smartKeywords, setSmartKeywords] = useState([]);

  const handleKeywordResponse = response => {
    const keywords = response.data.attributes.text;

    const extractedKeywords = keywords.split("\n").splice(2, 5);

    const formattedKeywords = extractedKeywords.map(keyword =>
      keyword.substring(3)
    );

    setSmartKeywords(formattedKeywords);
  };

  const getKeywordSuggestions = () => {
    const url = `${process.env.AI_API_URL}/api/v1/keywords?`;

    const queryTerm = toggleUseIndustry ? userIndustryName : "technology";

    const fullUrl = `${url}industry="${queryTerm}"`;

    fetch(fullUrl)
      .then(response => response.json())
      .then(response => handleKeywordResponse(response))
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

    updateClickedGenerateCount(megaphoneUserInfo.id);
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

  const userIndustryName = Object.keys(INDUSTRIES).find(
    key => INDUSTRIES[key] === megaphoneUserInfo?.industry
  );

  return (
    <>
      <p className="text-left mt-5 text-white font-semibold text-lg md:w-9/12 w-11/12 text-base">
        Use this portal to get topic suggestions and more using the latest in
        artificial intelligence.
      </p>
      <div className="w-full justify-center items-center 2xl:px20">
        <div className="flex w-full flex-col items-center mt-5">
          <div className="w-full justify-between flex flex-wrap md:flex-nowrap">
            <div className="w-full flex flex-col justify-items-center">
              <h3 className="text-white text-3xl font-bold text-center">
                My Keywords
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
                  <Button text={"Generate"} handleClick={handleSubmit} />
                </div>
                <div className="flex w-full justify-around">
                  <div className="text-white pt-5 pb-2">
                    <p>Use your industry:</p>
                    <p>({userIndustryName})?</p>
                  </div>
                  <div className="self-right self-center">
                    <IndustrySwitch
                      toggleUseIndustry={toggleUseIndustry}
                      setToggleUseIndustry={setToggleUseIndustry}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col items-center">
              <div className="flex flex-col mt-2 w-full">
                <h2 className="text-white font-bold self-center rounded-full p-2">
                  Keywords for You
                </h2>
                <div className="flex flex-wrap justify-evenly w-full self-center">
                  {smartKeywords.map((keyword, i) => (
                    <button
                      className="text-[#2D104F] font-bold bg-white rounded-full text-center text-sm pr-3 pl-3 mt-2 mr-3 pt-1 pb-1 cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
                      key={i}
                      onClick={() => moveKeyword(keyword, i)}
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between w-full mt-5">
                <h3 className="text-white text-3xl font-bold text-center my-2 w-full">
                  Generated Topics
                </h3>
              </div>
              <div className="bg-[#3A1F5C] rounded-xl mt-2 w-4/5 md:w-full">
                {isLoading ? (
                  <Loader />
                ) : (
                  <ul className="p-5 flex flex-col items-left space-y-2 pl-5">
                    {freshTopics.length != 0 ? (
                      freshTopics.map((topic, i) => (
                        <TopicRow
                          topic={topic}
                          key={i}
                          userId={megaphoneUserInfo.id}
                          i={i}
                          refetch={refetchUserTopics}
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
                  <li className="font-bold text-white border-[#4E376A] border-2 text-sm rounded-xl border-solid text-center pr-5 pl-5 mt-2 mr-3 pt-2 pb-2">
                    You used:
                  </li>
                  {inputKeywords.map(
                    (keyword, i) =>
                      keyword != "" && (
                        <Button
                          text={keyword}
                          handleClick={() => moveKeyword(keyword)}
                          customStyles={
                            "text-[#2D104F] font-bold bg-white rounded-full text-center text-sm pr-3 pl-3 mt-2 mr-3 pt-1 pb-1 cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
                          }
                        />
                      )
                  )}
                </ul>
              )}
            </div>
          </div>
          {userTopics.length != 0 && (
            <div className="w-4/5">
              <div className="flex justify-center pt-10">
                <h3 className="text-white text-3xl font-bold my-2 pr-5">
                  My Saved Topics
                </h3>
                <TopicFilter
                  setFilterTopicsBy={setFilterTopicsBy}
                  filterTopicsBy={filterTopicsBy}
                />
              </div>
              <div className="bg-[#3A1F5C] rounded-xl mt-2">
                <div className="w-full self-start">
                  <TopicInputForm
                    userId={megaphoneUserInfo?.id}
                    refetch={refetchUserTopics}
                  />
                </div>
                <div
                  className={
                    "p-5 flex flex-col items-left space-y-2 pl-5 md:min-h-[400px] h-full"
                  }
                >
                  {topicPages[currentPage].map((topic, i) => (
                    <UserTopic
                      id={i}
                      key={topic.id}
                      topic={topic}
                      refetch={refetchUserTopics}
                    />
                  ))}
                </div>
                <div className="flex justify-between content-end pl-5 pr-5">
                  <div className="text-left text-blue-400">
                    {backArrowVisible() ? (
                      <p
                        className="cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 text-xl"
                        onClick={() => flipTopicPageForward(false)}
                      >
                        <BsFillArrowLeftCircleFill />
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </div>
                  <div className="text-blue-300 pb-8">
                    {userTopics !== 0 && (
                      <div>
                        {currentPage + 1} of {numOfPages}
                      </div>
                    )}
                  </div>
                  <div className=" text-blue-400">
                    {forwardArrowVisible() ? (
                      <p
                        className="cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 text-xl"
                        onClick={() => flipTopicPageForward(true)}
                      >
                        <BsFillArrowRightCircleFill />
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TopicDashboard;
