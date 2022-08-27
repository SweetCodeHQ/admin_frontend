import React, { useContext } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";

import { Loader } from "./";

const commonStyles =
  "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={e => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const Welcome = () => {
  const executeLogin = () => {
    //Google API Key: AIzaSyBHLM0fONfuoie_iYVPSA55vJdTNiD3QJs
  };
  const handleChange = (e, name) => {
    setFormData(prevState => ({ ...prevState, [name]: e.target.value }));
  };
  const handleSubmit = () => {};
  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            Empowered <br /> Practitioner Marketing
          </h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Get professionals talking about your company through strategically
            selected topics and blog posts written by the experts at Fixate.
          </p>
          <button
            type="button"
            onClick={executeLogin}
            className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
          >
            <p className="text-white text-base font-semibold">
              Login With Google
            </p>
          </button>

          <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
            <div className={`rounded-tl-2xl ${commonStyles}`}>Marketing</div>
            <div className={commonStyles}>AI Powered</div>
            <div className={`rounded-tr-2xl ${commonStyles}`}>Fun</div>
            <div className={`rounded-bl-2xl ${commonStyles}`}>Organic</div>
            <div className={commonStyles}>Easy</div>
            <div className={`rounded-br-2xl ${commonStyles}`}>Intuitive</div>
          </div>
        </div>

        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5"></div>
          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-start blue-glassmorphism">
            <Input
              placeholder="First Keyword"
              name="firstKeyword"
              type="text"
              handleChange={handleChange}
            />
            <Input
              placeholder="Second Keyword"
              name="secondKeyword"
              type="text"
              handleChange={handleChange}
            />
            <Input
              placeholder="Third Keyword"
              name="thirdKeyword"
              type="text"
              handleChange={handleChange}
            />
            <div className="h-[1px] w-full bg-gray-400 my-2" />
            {false ? (
              <Loader />
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer"
              >
                Request Topics
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
