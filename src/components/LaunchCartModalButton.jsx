import { useContext, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

import { CartContext, UserContext } from "../context";

import "tw-elements";

const LaunchCartModalButton = ({ handleSubmitTopics }) => {
  const { gToken, setGToken } = useContext(UserContext);

  const { includeGoogleDoc, setIncludeGoogleDoc } = useContext(CartContext);

  const handleCloseModal = () => {
    setIncludeGoogleDoc(prev => false);
  };

  const handleGoogleDocClick = () => {
    const currentDoc = includeGoogleDoc;
    if (!currentDoc) handleAccessToken();
    setIncludeGoogleDoc(prev => !prev);
  };

  const handleAccessToken = () => {
    docsAuthToken();
  };

  const docsAuthToken = useGoogleLogin({
    onSuccess: tokenResponse => setGToken(tokenResponse),
    scope: "https://www.googleapis.com/auth/documents",
    flow: "implicit"
  });

  const handleSendTopics = () => {
    {
      /*Try block, with an option for if the doc creation returns with 1. expired token and 2. other processing error*/
    }
    handleSubmitTopics();
  };

  return (
    <>
      <button
        type="button"
        className="pr-5 pl-5 p-2 mt-2 text-[#2D104F] bg-white font-bold text-base leading-tight rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg hover:text-white transition duration-150 ease-in-out"
        data-bs-toggle="modal"
        data-bs-target="#submitTopicsConfirmation"
      >
        Send All
      </button>
      <div
        className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
        id="submitTopicsConfirmation"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog relative w-auto pointer-events-none">
          <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md bg-[#2D104F]">
              <h5
                className="text-xl font-medium leading-normal text-white"
                id="exampleModalLabel"
              >
                Send these topics?
              </h5>
              <button
                type="button"
                className="btn-close box-content w-4 h-4 p-1 bg-white text-white border-none rounded-full opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body relative p-4 text-black bg-purple-100">
              Click "Send Topics" to confirm that you want to send these topics
              to the experts at Fixate.
              <div className="flex justify-center pt-2">
                <div>
                  <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                    <input
                      className="relative float-left mt-[0.15rem] mr-[6px] -ml-[1.5rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 dark:border-neutral-600 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary dark:checked:border-primary checked:bg-primary dark:checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:ml-[0.25rem] checked:after:-mt-px checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-t-0 checked:after:border-l-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:ml-[0.25rem] checked:focus:after:-mt-px checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-t-0 checked:focus:after:border-l-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent"
                      onChange={handleGoogleDocClick}
                      type="checkbox"
                      checked={includeGoogleDoc}
                      value=""
                      id="checkboxDefault"
                    />
                    <label
                      className="inline-block pl-[0.15rem] hover:cursor-pointer"
                      htmlFor="checkboxDefault"
                    >
                      Send a copy to my Google Docs!
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md bg-purple-300">
              <button
                type="button"
                className="px-6 py-2.5 bg-white text-[#2D104F] font-bold text-sm leading-tight uppercase rounded-full shadow-md hover:shadow-lg focus:bg-purple-700 focus:shadow-lg line-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out hover:-translate-y-1 hover:scale-105"
                data-bs-dismiss="modal"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                type="button"
                className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm leading-tight uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1 hover:-translate-y-1 hover:scale-105"
                data-bs-dismiss="modal"
                onClick={handleSendTopics}
              >
                Send Topics
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LaunchCartModalButton;
