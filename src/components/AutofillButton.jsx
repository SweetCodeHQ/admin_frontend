import { gql, useQuery, useMutation } from "@apollo/client";

const AutofillButton = ({ megaphoneUserInfo, handleSuggest }) => {
  const numOfGenerateClicks = megaphoneUserInfo?.clickedGenerateCount;
  const numOfLogins = megaphoneUserInfo?.loginCount;
  console.log(numOfLogins);

  const determineButtonDisabled = () => {
    if (numOfGenerateClicks < 3 || numOfLogins < 3) {
      return true;
    } else {
      return false;
    }
  };

  const determineOpacity = () => {
    let opacity = 20;
    if (numOfLogins <= 3) opacity += numOfLogins * 10;
    if (numOfLogins > 3) opacity += 30;
    if (numOfGenerateClicks <= 3) opacity += numOfGenerateClicks * 10;
    if (numOfGenerateClicks > 3) opacity += 30;
    return `disabled:opacity-${opacity}`;
  };

  const opacity = determineOpacity();

  const setTitle = () => {
    if (determineButtonDisabled()) {
      const loginSentence = `Login ${
        numOfLogins < 3 ? 3 - numOfLogins : null
      } more times to unlock.`;
      const generationSentence = `Generate topics ${
        numOfGenerateClicks < 3 ? 3 - numOfGenerateClicks : null
      } more times to unlock.`;
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
