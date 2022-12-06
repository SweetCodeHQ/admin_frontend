import logo from "../../images/logo.png";

const Footer = () => {
  const openInNewTab = url => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full flex md:justify-center justify-between items-center flex-col p-4">
      <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
        <div className="flex flex-0.5 justify-center items-center">
          <img
            src={logo}
            alt="Megaphone Logo"
            className="w-32"
            data-cy="FLogo"
          />
        </div>
        <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
          <div className="text-[#2D104F] text-base font-semibold text-center mx-2 cursor-pointer p-2 pr-5 pl-5 bg-white rounded-full">
            About
          </div>
          <button
            onClick={() => openInNewTab("https://sweetcode.io")}
            className="text-[#2D104F] text-base font-semibold text-center mx-2 cursor-pointer p-2 pr-5 pl-5 bg-white rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
          >
            Sweetcode.io
          </button>
          <button
            onClick={() => openInNewTab("https://fixate.io")}
            className="text-[#2D104F] text-base font-semibold text-center mx-2 cursor-pointer p-2 pr-5 pl-5 bg-white rounded-full cursor-pointer transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
          >
            Fixate.io
          </button>
        </div>
      </div>
      <div className="flex justify-center items-center flex-col mt-5">
        <p className="text-white text-small text-center">
          Empowering Content Marketers Since 2022
        </p>
        <p className="text-white text-small text-center">
          Built By Fixate, Powered by OpenAI
        </p>
      </div>
      <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5" />
      <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
        <p className="text-white text-small text-center">@Fixate 2022</p>
        <p className="text-white text-small text-center">All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
