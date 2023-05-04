import { Button, Loader } from "../components";

const NoAbstract = ({ handleCreateAbstract, isLoading }) => {
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <p className="text-md text-white mb-3">
            Uh, oh! Looks like there's no abstract yet.
          </p>
          <Button
            customStyles="bg-white py-2 px-7 mx-4 mb-2 rounded-full cursor-pointer font-bold text-[#2D104F] transition delay-50 ease-in-out hover:-translate-y-1 hover:scale-105"
            text="Generate an Abstract!"
            handleClick={handleCreateAbstract}
          />
        </>
      )}
    </>
  );
};

export default NoAbstract;
