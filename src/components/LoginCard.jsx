import { useState, useContext } from "react";
import { useGoogleLogin } from "@react-oauth/google";

import { GoogleLoginButton, Input } from "../components";
import { UserContext } from "../context";
import { EnvelopeIcon, EnvelopeOpenIcon } from "@heroicons/react/20/solid";

const Waitlist = ({ clickedEmail, setClickedEmail, handleClickJoin }) => {
  const [waitlistForm, setWaitlistForm] = useState({ email: "" });

  const handleChange = (e, name) => {
    setWaitlistForm(prevState => ({ ...prevState, [name]: e.target.value }));
  };

  return (
    <>
      {clickedEmail ? (
        <div className="flex mt-3 items-center">
          <Input
            placeholder="YourEmail@gmail.com"
            customStyles="my-2 w-full rounded-lg p-2 text-white bg-[#4E376A]/75 placeholder-gray-400 text-sm shadow-inner shadow-lg hover:border-violet-500 border border-1 border-[#4E376A] focus:border-violet-500 focus:outline-indigo-500"
            handleChange={handleChange}
            name="email"
            type="email"
          />
          <button
            onClick={() => handleClickJoin(waitlistForm.email)}
            className="ml-2 text-gray-200 bg-indigo-700 hover:bg-indigo-500 rounded-lg h-1/2 p-1 pl-2 pr-2"
          >
            Join
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div
            onClick={() => setClickedEmail(true)}
            className="flex w-full items-center justify-center gap-3 rounded-md px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0] cursor-pointer bg-[#3A1F5C] hover:bg-[#3A1F5C]/90"
          >
            <div className="h-8 w-8">
              <EnvelopeIcon />
            </div>
            <span className="text-sm font-semibold leading-6">Gmail</span>
          </div>

          <div
            onClick={() => setClickedEmail(true)}
            className="flex w-full items-center justify-center gap-3 rounded-md bg-[#3A1F5C] hover:bg-[#3A1F5C]/90 px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] cursor-pointer"
          >
            <div className="h-8 w-8">
              <EnvelopeOpenIcon />
            </div>
            <span className="text-sm font-semibold leading-6">Other Email</span>
          </div>
        </div>
      )}
    </>
  );
};

const LoginCard = ({ loginCallback }) => {
  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: tokenResponse => loginCallback(tokenResponse)
  });

  const [clickedEmail, setClickedEmail] = useState(false);
  const [clickedJoin, setClickedJoin] = useState(false);

  const [clickedSignup, setClickedSignup] = useState(false);

  const { createUserMutation } = useContext(UserContext);

  const handleClickJoin = async email => {
    try {
      await createUserMutation(email);
      setClickedJoin(true);
    } catch (e) {
      console.log(e);
      alert("Sorry! There was an error. Please try again.");
    }
  };

  return (
    <div id="loginCard">
      <div className="sm:mx-auto sm:w-full sm:max-w-[480px] py-6 mt-20">
        <div className="bg-white/25 px-6 py-7 shadow sm:rounded-lg sm:px-12">
          <div className="relative">
            <div className="relative flex justify-center text-lg font-medium leading-6">
              <span className="rounded-md bg-[#3A1F5C] px-3 py-1.5 font-semibold text-white">
                Continue With Google Workspace
              </span>
            </div>
          </div>
          <GoogleLoginButton
            loginCallback={loginCallback}
            text={clickedSignup ? "signin_with" : "signup_with"}
          />
          <div>
            <div className="mt-5 bg-[#3A1F5C] rounded-lg w-2/5 py-1">
              <span
                onClick={() => setClickedSignup(prev => !prev)}
                className="bg-gradient-to-r pl-4 cursor-pointer from-[#ffc857] to-red-300 text-transparent underline-offset-4 decoration-red-300 bg-clip-text hover:underline mr-1"
              >
                {clickedSignup ? "Sign up" : "Sign in"}
              </span>
              <span className="text-white">instead?</span>
            </div>
            <div className="relative mt-5">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span
                  className={`${"bg-[#3A1F5C]"} px-6 text-white rounded-lg`}
                >
                  {clickedEmail
                    ? "Join our waitlist!"
                    : "Or join the waitlist with"}
                </span>
              </div>
            </div>
            {clickedJoin ? (
              <div className="rounded-xl mt-5 p-2 bg-[#4E376A] text-white text-center mb-2">
                <p>Thanks for joining! We'll be in touch soon!</p>
              </div>
            ) : (
              <Waitlist
                clickedEmail={clickedEmail}
                setClickedEmail={setClickedEmail}
                handleClickJoin={handleClickJoin}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
