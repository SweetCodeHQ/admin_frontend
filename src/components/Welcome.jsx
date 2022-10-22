const commonStyles =
  "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Welcome = () => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl sm:text-5xl text-white text-center text-bold py-1">
        Empowered <br /> Practitioner Marketing
      </h1>
      <p className="text-left mt-5 text-white font-light text-center md:w-9/12 w-11/12 text-base">
        Get professionals talking about your company through strategically
        selected topics and blog posts written by the experts at Fixate.
      </p>
      <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
        <div className={`rounded-tl-2xl ${commonStyles}`}>Marketing</div>
        <div className={commonStyles}>AI Powered</div>
        <div className={`rounded-tr-2xl ${commonStyles}`}>Fun</div>
        <div className={`rounded-bl-2xl ${commonStyles}`}>Organic</div>
        <div className={commonStyles}>Easy</div>
        <div className={`rounded-br-2xl ${commonStyles}`}>Intuitive</div>
      </div>
    </div>
  );
};

export default Welcome;
