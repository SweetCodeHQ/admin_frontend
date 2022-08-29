import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Entities } from "../components";
import { gql, useQuery, useMutation } from "@apollo/client";
import jwt_decode from "jwt-decode";

const commonStyles =
  "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const GET_USER_PROFILE = gql`
  query userByEmail($email: String!) {
    user(email: $email) {
      id
      email
      isAdmin
    }
  }
`;

const CREATE_USER = gql`
  mutation createUser($email: String!) {
    createUser(input: { email: $email }) {
      id
      email
      isAdmin
    }
  }
`;

const Dashboard = () => {
  const {
    handleCallbackResponse,
    handleSignOut,
    createUserMutation,
    userCallback
  } = useContext(UserContext);
  const user = useContext(UserContext);
  const email = user?.user?.email;

  const { data } = useQuery(GET_USER_PROFILE, { variables: { email } });

  useEffect(() => {
    {
      /*global google*/
    }
    google.accounts.id.initialize({
      client_id:
        "370692924501-o701jqakpplacn0r5cohmiv7q6firec5.apps.googleusercontent.com",
      callback: userCallback
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large"
    });
  }, []);

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start flex-col mf:mr-10">
          {data?.user?.isAdmin ? (
            <>
              <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
                Welcome back, <br /> {user.user.given_name}!
              </h1>
              <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                Use this portal to manage administrators, entities, users, and
                more.
              </p>
              <Entities />
            </>
          ) : (
            <>
              <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
                Empowered <br /> Practitioner Marketing
              </h1>
              <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                Get professionals talking about your company through
                strategically selected topics and blog posts written by the
                experts at Fixate.
              </p>
              {data?.user?.isAdmin === false && (
                <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                  Hi, {user?.user?.given_name}! Visit "this link" to use this
                  service.
                </p>
              )}
              <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
                <div className={`rounded-tl-2xl ${commonStyles}`}>
                  Marketing
                </div>
                <div className={commonStyles}>AI Powered</div>
                <div className={`rounded-tr-2xl ${commonStyles}`}>Fun</div>
                <div className={`rounded-bl-2xl ${commonStyles}`}>Organic</div>
                <div className={commonStyles}>Easy</div>
                <div className={`rounded-br-2xl ${commonStyles}`}>
                  Intuitive
                </div>
              </div>
            </>
          )}
          {user.user && (
            <button
              id="signOutDiv"
              type="button"
              onClick={e => handleSignOut(e)}
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
            >
              <p className="text-white text-base font-semibold">Logout</p>
            </button>
          )}
          <div
            id="signInDiv"
            className="p-3 flex-row justify-center items-center mt-6 mx-auto"
          >
            Login With Google
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
