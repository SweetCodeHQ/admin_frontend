import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { EntityContext, EntityContextProvider } from "../context/EntityContext";
import {
  EntityDashboard,
  AdminUserDashboard,
  TopicDashboard
} from "../components";
import { gql, useQuery, useMutation } from "@apollo/client";
import { GoogleLogin } from "@react-oauth/google";

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

const CREATE_USER_ENTITY = gql`
  mutation CreateUserEntity($userId: ID!, $entityId: ID!) {
    createUserEntity(input: { userId: $userId, entityId: $entityId }) {
      id
    }
  }
`;

const GET_ENTITY = gql`
  query entityByUrl($url: String!) {
    entity(url: $url) {
      id
      name
      url
    }
  }
`;

const Dashboard = () => {
  const { handleSignOut, userCallback } = useContext(UserContext);

  const user = useContext(UserContext);
  const email = user?.user?.email;
  const userHd = user?.user?.hd;
  const formData = useContext(EntityContext);

  const { data: userData, refetch: refetchUser } = useQuery(GET_USER_PROFILE, {
    variables: { email }
  });

  const { data: entityData, refetch: refetchEntity } = useQuery(GET_ENTITY, {
    variables: { url: userHd },
    onError: error => console.log(error)
  });

  const loginCallback = response => {
    const currentUser = userCallback(response);
    userEntityCallback(currentUser);
  };

  const userEntityCallback = async currentUser => {
    const megaphoneUserResponse = await refetchUser({
      email: currentUser.email
    });

    const userId = megaphoneUserResponse.data.user.id;

    const megaphoneEntityResponse = await refetchEntity({
      url: currentUser.hd
    });

    const entityId = megaphoneEntityResponse.data.entity.id;

    createUserEntityMutation(userId, entityId);
  };

  const [
    userEntityMutationData,
    { loading, error }
  ] = useMutation(CREATE_USER_ENTITY, { onError: error => console.log(error) });

  const createUserEntityMutation = (userId, entityId) => {
    const input = { userId: userId, entityId: entityId };

    userEntityMutationData({ variables: input });
  };

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start flex-col mf:mr-10">
          {userData?.user ? (
            <>
              <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
                Welcome back, <br /> {user.user.given_name}!
              </h1>
              {userData?.user?.isAdmin ? (
                <>
                  <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                    Use this portal to manage administrators, entities, users,
                    and more.
                  </p>
                  <div className="flex flex-col flex-1 items-center justify-start mf:mt-0 mt-10">
                    <EntityContextProvider formData={formData}>
                      <EntityDashboard />
                    </EntityContextProvider>
                    <AdminUserDashboard />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                    Use this portal to get topic suggestions and more using the
                    latest in artificial intelligence.
                  </p>
                  <TopicDashboard userId={userData.user.id} />
                </>
              )}
              <button
                id="signOutDiv"
                type="button"
                onClick={e => handleSignOut(e)}
                className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-purple-800"
              >
                <p className="text-white text-base font-semibold">Logout</p>
              </button>
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
              <div className="p-5 w-full items-center flex flex-col">
                <GoogleLogin
                  onSuccess={credentialResponse => {
                    loginCallback(credentialResponse);
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </div>
            </>
          )}
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
