import { useState, useEffect } from 'react';
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from 'react-icons/bs';
import curioLogoTagline from '../assets/curioLogoTagline.png'
import { useQuery } from '@apollo/client';

import {
  Button,
  Loader,
  TopicRow,
  UserTopic,
  TopicInputForm,
  TopicFilter,
  KeywordInterface,
} from '.';

import { filterBySubmitted, filterByNotSubmitted } from '../constants/filters';
import { GET_USER_TOPICS } from '../graphql/queries'


const TopicDashboard = ({ userId, userIndustry }) => {
  const [formData, setFormData] = useState({
    word1: '',
    word2: '',
    word3: '',
    word4: '',
    word5: '',
  });

  const [inputKeywords, setInputKeywords] = useState(null);

  const [keywordIds, setKeywordIds] = useState([]);

  const [freshTopics, setFreshTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [userTopics, setUserTopics] = useState([]);
  const [topicPages, setTopicPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const calculateCurrentPage = () => {
    setCurrentPage(0);
  };

  const numOfPages = topicPages.length;

  const backArrowVisible = () => currentPage !== 0;

  const forwardArrowVisible = () => {
    if (numOfPages === 1) return false;
    return currentPage + 1 !== numOfPages;
  };

  const [filterTopicsBy, setFilterTopicsBy] = useState('ALL');

  const filterTopics = () => {
    if (filterTopicsBy === 'ALL') {
      return userTopics;
    }
    if (filterTopicsBy === 'SUBMITTED') {
      return filterBySubmitted(userTopics);
    }
    if (filterTopicsBy === 'NOT SUBMITTED') {
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

  const paginateTopics = (topics) => {
    if (topics.length > 10) {
      const topicsArr = [...topics];
      const pages = [];
      while (topicsArr.length > 0) {
        const page = topicsArr.splice(0, 10);
        pages.push(page);
      }
      setTopicPages((prev) => pages);
    } else {
      setTopicPages((prev) => [topics]);
    }
  };

  const flipTopicPageForward = (direction) => {
    if (direction) return setCurrentPage((prev) => (prev += 1));
    if (!direction) return setCurrentPage((prev) => (prev -= 1));
  };

  const { data: userTopicsData, refetch: refetchUserTopics, error: topicsError } = useQuery(
    GET_USER_TOPICS,
    {
      context: { headers: { authorization: `${process.env.QUERY_KEY}`, user: userId } },
      onError: (error) => console.log(error),
      onCompleted: (data) => setUserTopics(data.user.topics),
    }
  );

  const handleTopicResponse = (response) => {
    const topics = response.data.attributes.text;

    const formattedTopics = topics.split('\n').splice(0, 5);

    setIsLoading(false);
    setFreshTopics(formattedTopics);
  };

  const getTopicSuggestions = () => {
    const url = `${process.env.AI_API_URL}/api/v1/topics?`;

    const fullUrl = `${url}keywords="${formData.word1} ${formData.word2} ${formData.word3} ${formData.word4} ${formData.word5}"`;

    fetch(fullUrl)
      .then((response) => response.json())
      .then((response) => handleTopicResponse(response))
      .then((error) => console.log(error));
  };

  const moveKeyword = (word, i) => {
    let newForm;
    if (formData.word1 === '') {
      newForm = {
        ...formData,
        word1: word,
      };
    } else if (formData.word2 === '') {
      newForm = {
        ...formData,
        word2: word,
      };
    } else if (formData.word3 === '') {
      newForm = {
        ...formData,
        word3: word,
      };
    } else if (formData.word4 === '') {
      newForm = {
        ...formData,
        word4: word,
      };
    } else if (formData.word5 === '') {
      newForm = {
        ...formData,
        word5: word,
      };
    } else {
      newForm = {
        ...formData,
        word5: word,
      };
    }

    setFormData(newForm);
  };

  return (
    <>
      <p className="text-left mt-5 ml-5 text-white font-semibold text-lg md:w-9/12 w-11/12">
        Use this portal to get topic suggestions and abstracts using the latest in
        artificial intelligence.
      </p>
      <div className="w-full justify-center items-center 2xl:px20">
        <div className="flex w-full flex-col items-center mt-5">
          <div className="w-full justify-between flex flex-wrap md:flex-nowrap">
            <KeywordInterface
              formData={formData}
              setFormData={setFormData}
              userIndustry={userIndustry}
              userId={userId}
              keywordIds={keywordIds}
              setKeywordIds={setKeywordIds}
              getTopicSuggestions={getTopicSuggestions}
              setIsLoading={setIsLoading}
              setInputKeywords={setInputKeywords}
              moveKeyword={moveKeyword}
            />
            <div className="w-full flex flex-col">
              <img src={curioLogoTagline} className="w-[300px] self-center hidden md:block -translate-y-10" />
              <div className="flex flex-col w-full">
                <h3 className="text-white text-3xl font-bold text-center my-2 w-full">
                  Generated Topics
                </h3>
                <div className="bg-[#3A1F5C] rounded-xl mt-2 w-4/5 md:w-full self-center">
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
                            refetch={refetchUserTopics}
                            keywordIds={keywordIds}
                          />
                        ))
                      ) : (
                        <h1 className="text-purple-400/70 text-center text-xl">
                          Input keywords and click 'Generate' to see topics.
                        </h1>
                      )}
                    </ul>
                  )}
                </div>
              </div>
              <div>
                {inputKeywords && (
                  <div className="flex flex-col">
                    <h4 className="font-bold text-white bg-[#3A1F5C] border-2 border-b-0 text-sm rounded-t-xl rounded-b-md border-solid text-center mt-2 pt-2 pb-2 w-2/5 self-center">
                      You used:
                    </h4>
                    <ul className="flex w-full justify-around bg-[#3A1F5C] border-2 p-3 rounded-xl">
                      {inputKeywords.map(
                        (keyword, i) =>
                          keyword != '' && (
                            <Button
                              key={`inspiration ${i}`}
                              text={keyword.toUpperCase()}
                              handleClick={() => moveKeyword(keyword)}
                              customStyles="text-[#2D104F] font-bold bg-white rounded-full text-center text-sm pr-3 pl-3 pt-1 pb-1 cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
                            />
                          )
                      )}
                    </ul>
                  </div>
                )}
              </div>
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
              <div className="bg-[#3A1F5C] rounded-xl mt-2 min-w-fit">
                <TopicInputForm
                  userId={userId}
                  refetch={refetchUserTopics}
                />
                <div className="p-5 flex flex-col items-left space-y-2 pl-5 md:min-h-[400px] h-full">
                  {topicPages[currentPage]?.map((topic, i) => (
                    <UserTopic
                      userId={userId}
                      key={topic.id}
                      topicId={topic.id}
                      createdAt={topic.createdAt}
                      submitted={topic.submitted}
                      topicText={topic.text}
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
                      <p />
                    )}
                  </div>
                  <div className="text-blue-300 pb-8">
                    {userTopics !== 0 && (
                      <div data-id="num-pages" data-num-pages={numOfPages}>
                        {currentPage + 1} of {numOfPages}
                      </div>
                    )}
                  </div>
                  <div className=" text-blue-400">
                    {forwardArrowVisible() ? (
                      <p
                        className="cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 text-xl"
                        data-id="next-button"
                        onClick={() => flipTopicPageForward(true)}
                      >
                        <BsFillArrowRightCircleFill />
                      </p>
                    ) : (
                      <p />
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
