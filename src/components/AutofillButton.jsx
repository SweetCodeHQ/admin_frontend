import { gql, useQuery, useMutation } from "@apollo/client";

const AutofillButton = ({ megaphoneUserInfo, handleSuggest }) => {
  const numOfGenerateClicks = megaphoneUserInfo?.clickedGenerateCount;
  const numOfLogins = megaphoneUserInfo?.loginCount;

  const determineButtonDisabled = () => {
    if (numOfGenerateClicks < 3 || numOfLogins < 3) {
      return true;
    } else {
      return false;
    }
  };

  const determineOpacity = () => {
    let opacity = 10;
    if (numOfLogins <= 3) opacity += numOfLogins * 10;
    if (numOfLogins > 3) opacity += 30;
    if (numOfGenerateClicks <= 3) opacity += numOfGenerateClicks * 10;
    if (numOfGenerateClicks > 3) opacity += 30;
    return `disabled:opacity-${opacity}`;
  };

  const opacity = determineOpacity();

  const sentenceFormat = (item, num) => {
    if (num < 2) {
      return `${item} ${3 - num} more time${
        3 - num === 1 ? "" : "s"
      } to unlock.`;
    } else if (num === 2) {
      return `${item} 1 more time to unlock.`;
    } else {
      return ``;
    }
  };

  const setTitle = () => {
    if (determineButtonDisabled()) {
      const loginSentence = sentenceFormat("Login", numOfLogins);
      const generationSentence = sentenceFormat(
        "Generate topics",
        numOfGenerateClicks
      );
      return `${loginSentence} ${generationSentence}`;
    } else {
      return null;
    }
  };

  return (
    <button
      type="button"
      disabled={determineButtonDisabled()}
      onClick={handleSuggest}
      className={`text-[#2D104F] bg-white pr-5 pl-5 p-2 mt-2 font-bold rounded-full cursor-pointer transition duration-150 ease-in-out enabled:hover:-translate-y-1 enabled:hover:scale-105 ${opacity} disabled:cursor-help disabled:bg-gradient-to-r disabled:from-pink-500 disabled:to-yellow-500`}
      data-bs-toggle="tooltip"
      data-bs-placement="right"
      title={setTitle()}
    >
      Autofill
    </button>
  );
};

export default AutofillButton;
