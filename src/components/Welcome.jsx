import { LoginCard } from "../components";

const Welcome = ({ loginCallback }) => {
  return (
    <div className="flex flex-col h-full content-between">
      <div className="flex flex-col items-center mb-5">
        <h1 className="text-3xl sm:text-5xl text-white text-center text-bold py-1">
          Intelligent <br /> Content Curation
        </h1>
        <p className="text-left mt-5 text-white font-light text-center md:w-9/12 w-11/12 text-2xl">
          Helping contributors ideate and create targeted content faster.
        </p>
      </div>
      <LoginCard loginCallback={loginCallback} />
    </div>
  );
};

export default Welcome;
