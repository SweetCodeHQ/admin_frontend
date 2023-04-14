import logo from "../../images/logo.png";
import { Button } from "../components";

const Footer = () => {
  const openInNewTab = url => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const today = new Date();
  const year = today.getFullYear();

  return (
    <div className="w-full flex md:justify-center justify-between items-center flex-col p-4">
      <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
        <div className="flex flex-0.5 justify-center items-center"></div>
        <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
          <Button
            handleClick={() => openInNewTab("https://fixate.io")}
            text={"About"}
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
        <p className="text-white text-small text-center">All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
