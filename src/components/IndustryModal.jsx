import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { INDUSTRIES } from "../constants/industries";

const UPDATE_INDUSTRY = gql`
  mutation updateIndustry($id: ID!, $industry: Int!) {
    updateUser(input: { id: $id, industry: $industry }) {
      id
      email
      industry
    }
  }
`;

const Industry = ({ data, setSelectedIndustry }) => {
  return (
    <li>
      <a
        className={`
          dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white focus:text-white focus:bg-gray-700
        `}
        onClick={e => setSelectedIndustry(data)}
      >
        {data[0]}
      </a>
    </li>
  );
};

const IndustryModal = ({ megaphoneUserId }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const updateIndustry = industryCode => {
    const input = { id: megaphoneUserId, industry: selectedIndustry[1] };
    updateIndustryMutation({ variables: input });
  };

  const [updateIndustryMutation, { error }] = useMutation(UPDATE_INDUSTRY, {
    onCompleted: data => console.log(data),
    onError: error => console.log(error)
  });

  return (
    <div className="z-50 fixed top-0 -left-2 p-3 w-full h-screen shadow-2xl list-none flex flex-col items-center rounded-md blue-glassmorphism text-white animate-slide-in">
      <h1 className="font-extrabold text-2xl underline underline-offset-2 pb-10">
        Please select a segment from within the tech industry.
      </h1>
      <div className="flex justify-center">
        <div>
          <div className="dropdown relative">
            <button
              className="dropdown-toggle inline-block px-6 py-2.5 bg-[#2D104F] text-white font-medium text-lg leading-tight uppercase rounded shadow-md hover:bg-white hover:text-[#2D104F] hover:shadow-lg focus:bg-white focus:text-[#2D104F] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-white active:shadow-lg active:text-[#2D104F] transition duration-150 ease-in-out flex items-center whitespace-nowrap"
              type="button"
              id="dropdownMenuButton2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {selectedIndustry ? selectedIndustry[0] : "Segment"}
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="caret-down"
                className="w-2 ml-2"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path
                  fill="currentColor"
                  d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
                ></path>
              </svg>
            </button>
            <ul
              className="dropdown-menu min-w-max absolute hidden bg-white text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding border-none bg-gray-800"
              aria-labelledby="dropdownMenuButton2"
            >
              {Object.entries(INDUSTRIES).map((industry, i) => (
                <Industry
                  key={i}
                  setSelectedIndustry={setSelectedIndustry}
                  data={industry}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
      {selectedIndustry && (
        <button
          className="bg-white py-2 px-7 mx-4 rounded-full cursor-pointer font-bold text-[#2D104F] transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105 mt-5"
          onClick={updateIndustry}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default IndustryModal;
