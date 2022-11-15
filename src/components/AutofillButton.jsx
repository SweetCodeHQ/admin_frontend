import { gql, useQuery, useMutation } from "@apollo/client";

const AutofillButton = ({ megaphoneUserInfo, handleSuggest }) => {
  return (
    <button
      type="button"
      disabled={true}
      onClick={handleSuggest}
      className="text-[#2D104F] bg-white pr-5 pl-5 p-2 mt-2 font-bold rounded-full cursor-pointer transition duration-150 ease-in-out enabled:hover:-translate-y-1 enabled:hover:scale-105 disabled:opacity-60"
      data-bs-toggle="tooltip"
      data-bs-placement="right"
      title="Login 3 times and generate topics 3 times."
    >
      Autofill
    </button>
  );
};

export default AutofillButton;
