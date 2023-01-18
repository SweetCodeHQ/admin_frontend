const commonStyles =
  "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Welcome = () => {
  return (
    <div className="flex flex-col items-center h-screen">
      <h1 className="text-3xl sm:text-5xl text-white text-center text-bold py-1">
        Intelligent <br /> Content Curation
      </h1>
      <p className="text-left mt-5 text-white font-light text-center md:w-9/12 w-11/12 text-2xl">
        Helping contributors ideate and create targeted content faster.
      </p>
      {/*<div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
        <div className={`rounded-l-2xl ${commonStyles}`}>AI Powered</div>
        <div className={commonStyles}> Organic</div>
        <div className={`rounded-r-2xl ${commonStyles}`}>Intuitive</div>
      </div>*/}
    </div>
  );
};

export default Welcome;
