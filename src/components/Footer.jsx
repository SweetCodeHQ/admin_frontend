import { useState } from "react";
import logo from "../../images/logo.png";
import { Button, Welcome, PrivacyPolicy } from "../components";

const Footer = () => {
  const openInNewTab = url => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const today = new Date();
  const year = today.getFullYear();

  const [clickedAbout, setClickedAbout] = useState(false);

  const [clickedPrivacyPolicy, setClickedPrivacyPolicy] = useState(false);

  return (
    <div className="w-full flex md:justify-center justify-between items-center flex-col p-4">
      {clickedAbout ? (
        <div className="z-50 overflow-y-scroll overscroll-none fixed top-0 w-screen h-screen shadow-2xl flex flex-col justify-start items-end rounded-md blue-glassmorphism animate-slide-in transition ease-in-out">
          <Welcome setClickedAbout={setClickedAbout} />
        </div>
      ) : null}
      {clickedPrivacyPolicy ? (
        <div className="z-50 overflow-y-scroll overscroll-none fixed top-0 w-screen h-screen shadow-2xl flex flex-col rounded-md blue-glassmorphism animate-slide-in transition ease-in-out">
          <PrivacyPolicy setClickedPrivacyPolicy={setClickedPrivacyPolicy} />
        </div>
      ) : null}
      <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
        <div className="flex flex-0.5 justify-center items-center"></div>
        <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
          <Button
            handleClick={() => setClickedAbout(prev => !prev)}
            text={clickedAbout ? "Close" : "About"}
          />
        </div>
      </div>
      <div className="flex justify-center items-center flex-col mt-5">
        <p className="text-white text-small text-center">
          Empowering Content Marketers Since 2014
        </p>
        <p className="text-white text-small text-center">
          Built By Fixate, Powered by OpenAI
        </p>
      </div>
      <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5" />
      <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
        <p className="text-white text-small text-center">
          @Fixate IO, LLC {year}
        </p>
        <button
          className="text-white text-small text-center underline underline-offset-2 hover:no-underline"
          onClick={() => setClickedPrivacyPolicy(prev => !prev)}
        >
          Privacy Policy
        </button>
        <p className="text-white text-small text-center">All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
