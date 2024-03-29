import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_KEYWORD, UPDATE_KEYWORD, CREATE_USER_KEYWORD, UPDATE_CLICKED_GENERATE_COUNT } from '../graphql/mutations'
import { Input, Button } from '.';
import { INDUSTRIES } from '../constants/industries';
import { callMutation } from '../utils/callMutation.js'

export const IndustrySwitch = ({ toggleUseIndustry, setToggleUseIndustry }) => {
  const enabledClass = 'transform translate-x-5 bg-purple-500';

  const flipStatus = () => {
    setToggleUseIndustry((prev) => !prev);
  };

  return (
    <div
      className="md:w-10 md:h-4 w-10 h-3 flex items-center white-glassmorphism rounded-full p-1 cursor-pointer"
      onClick={() => {
        flipStatus();
      }}
    >
      <div
        className={`white-glassmorphism md:w-3 md:h-3 h-2 w-2 rounded-full shadow-md transform duration-300 ease-in-out${
          toggleUseIndustry ? enabledClass : null
        }`}
      />
    </div>
  );
};

const KeywordInterface = ({
  userIndustry,
  userId,
  formData,
  setFormData,
  setKeywordIds,
  getTopicSuggestions,
  setIsLoading,
  setInputKeywords,
  moveKeyword
}) => {
  const [toggleUseIndustry, setToggleUseIndustry] = useState(true);

  const [smartKeywords, setSmartKeywords] = useState([]);

  const userIndustryName = Object.keys(INDUSTRIES).find(
    (key) => INDUSTRIES[key] === userIndustry
  );

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const [createKeyword] = useMutation(CREATE_KEYWORD, {
    context: { headers: { authorization: `${process.env.MUTATION_KEY}` } },
    onCompleted: (data) => console.log(data),
    onError: (error) => console.log(error),
  });

  const [updateKeyword] = useMutation(UPDATE_KEYWORD, {
    context: { headers: { authorization: `${process.env.MUTATION_KEY}` } },
    onCompleted: (data) => console.log(data),
    onError: (error) => console.log(error),
  });

  const [createUserKeyword] = useMutation(CREATE_USER_KEYWORD, {
    context: { headers: { authorization: `${process.env.MUTATION_KEY}`, user: userId } },
    onCompleted: (data) => console.log(data),
    onError: (error) => console.log(error),
  });

  useEffect(() => {
    getKeywordSuggestions();
  }, []);

  const handleKeywordResponse = (response) => {
    const keywords = response.data.attributes.text;
    const extractedKeywords = keywords.split(',').splice(0, 5);

    const formattedKeywords = extractedKeywords.map((keyword) => {
      if(keyword.charAt(keyword.length - 1) == ".")
        return keyword.substring(0, keyword.length - 1)
      else 
        return keyword.substring(0)
    }
    );

    setSmartKeywords(formattedKeywords);
  };

  const getKeywordSuggestions = () => {
    const url = `${process.env.AI_API_URL}/api/v1/keywords?`;

    const queryTerm =
      toggleUseIndustry && userIndustryName ? userIndustryName : 'technology';

    const fullUrl = `${url}industry="${queryTerm}"`;

    fetch(fullUrl)
      .then((response) => response.json())
      .then((response) => handleKeywordResponse(response))
      .then((error) => console.log(error));
  };

  const keywordActions = async (words) => {
    for (const word of words) {
      if (word) {
        const formattedWord = word.toLowerCase().trim()
        const keywordData = await callMutation({ word: formattedWord }, createKeyword)

        const keywordId = keywordData.data.createKeyword.id;
        console.log(keywordId)
        callMutation({ keywordId }, createUserKeyword)
        callMutation({ word: formattedWord }, updateKeyword )
        setKeywordIds((prev) => [...prev, keywordId]);
      }
    }
  };

  const handleSubmit = (e) => {
    if (!formData.word1 || !formData.word2 || !formData.word3)
      return alert('Please provide at least three keywords.');

    const words = Object.values(formData);

    getTopicSuggestions();
    setIsLoading(true);
    setInputKeywords(words);
    setKeywordIds([]);
    setFormData({ word1: '', word2: '', word3: '', word4: '', word5: '' });

    window.dataLayer.push({
      event: 'generate_topics',
      keywords: [
        formData.word1,
        formData.word2,
        formData.word3,
        formData.word4,
        formData.word5,
      ],
    });
    updateClickedGenerateMutationData();
    keywordActions(words);
  };

  const [updateClickedGenerateMutationData] = useMutation(
    UPDATE_CLICKED_GENERATE_COUNT,
    {
      context: { headers: { authorization: `${process.env.MUTATION_KEY}`, user: userId } },
      onCompleted: (data) => console.log(data),
      onError: (error) => console.log(error),
    }
  );

  return (
    <div className="w-full flex flex-col justify-items-center">
      <div className="flex flex-col mt-2 w-full">
        <h2 className="text-white font-bold self-center rounded-full p-2">
          Inspiration Words
        </h2>
        <div className="flex flex-wrap justify-evenly w-4/5 self-center">
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
        <div className="w-3/4 self-center border-t border-gray-200 mt-3" />
      </div>
      <h3 className="text-white text-3xl font-bold text-center mt-5">
        My Keywords
      </h3>
      <div className="p-5 pt-3 mt-3 w-4/5 max-w-[350px] flex flex-col justify-start items-start bg-[#3A1F5C] rounded-xl self-center">
        <Input
          placeholder="Keyword 1"
          name="word1"
          value={formData.word1}
          type="text"
          handleChange={handleChange}
        />
        <Input
          placeholder="Keyword 2"
          name="word2"
          value={formData.word2}
          type="text"
          handleChange={handleChange}
        />
        <Input
          placeholder="Keyword 3"
          name="word3"
          value={formData.word3}
          type="text"
          handleChange={handleChange}
        />
        <Input
          placeholder="Keyword 4 (optional)"
          name="word4"
          value={formData.word4}
          type="text"
          handleChange={handleChange}
        />
        <Input
          placeholder="Keyword 5 (optional)"
          name="word5"
          value={formData.word5}
          type="text"
          handleChange={handleChange}
        />
        <div className="flex w-full my-3">
          <div className="text-white">
            <p>Use your industry segment:</p>
            <p> ({userIndustryName || 'your industry'})?</p>
          </div>
          <div className="self-center ml-10">
            <IndustrySwitch
              toggleUseIndustry={toggleUseIndustry}
              setToggleUseIndustry={setToggleUseIndustry}
            />
          </div>
        </div>
        <div className="w-full border-t border-gray-200" />
        <div className="flex w-full justify-around flex-wrap mt-3">
          <Button text="Generate" handleClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default KeywordInterface;
