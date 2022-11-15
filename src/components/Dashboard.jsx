import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { EntityContext, EntityContextProvider } from "../context/EntityContext";
import {
  EntityDashboard,
  AdminUserDashboard,
  TopicDashboard,
  Welcome
} from "../components";

import { gql, useQuery, useMutation } from "@apollo/client";
import { GoogleLogin } from "@react-oauth/google";

import background from "../assets/WelcomeBG.png";

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

  const googleUser = useContext(UserContext);
  const email = googleUser?.googleUser?.email;
  const userHd = googleUser?.googleUser?.hd;

  const formData = useContext(EntityContext);

  const { data: megaphoneUserData, refetch: refetchUser } = useQuery(
    GET_USER_PROFILE,
    {
      variables: { email }
    }
  );

  const { data: entityData, refetch: refetchEntity } = useQuery(GET_ENTITY, {
    variables: { url: userHd },
    onError: error => console.log(error),
    onCompleted: data => console.log(data)
  });

  const loginCallback = async response => {
    const currentUser = userCallback(response);
    userEntityCallback(currentUser);
  };

  const userEntityCallback = async currentUser => {
    const megaphoneUserResponse = await refetchUser({
      email: currentUser.email
    });

    const megaphoneUserInfo = megaphoneUserResponse?.data?.user;
    console.log(megaphoneUserData);
    const megaphoneEntityResponse = await refetchEntity({
      url: currentUser.hd
    });

    const entityId = megaphoneEntityResponse.data.entity.id;

    createUserEntityMutation(megaphoneUserInfo.id, entityId);
  };

  const [userEntityMutationData, { loading, error }] = useMutation(
    CREATE_USER_ENTITY,
    {
      onError: error => console.log(error),
      onCompleted: data => console.log(data)
    }
  );

  const createUserEntityMutation = (megaphoneUserId, entityId) => {
    const input = { userId: megaphoneUserId, entityId: entityId };

    userEntityMutationData({ variables: input });
  };

  return (
    <div
      className="flex w-full justify-center items-center"
      style={
        googleUser?.googleUser && { backgroundImage: `url(${background})` }
      }
    >
      <div className="flex items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start flex-col mf:mr-10">
          <div className="p-5 w-full items-center flex flex-col">
            {!googleUser.googleUser && (
              <GoogleLogin
                shape="pill"
                onSuccess={credentialResponse => {
                  loginCallback(credentialResponse);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            )}
          </div>
          {googleUser?.googleUser ? (
            <>
              <h1 className="text-3xl sm:text-5xl text-white text-gradient font-bold py-1">
                Welcome back, <br />
                {googleUser?.googleUser?.given_name}!
              </h1>
              {megaphoneUserData?.user?.isAdmin ? (
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
                  <p className="text-left mt-5 text-white font-semibold text-lg md:w-9/12 w-11/12 text-base">
                    Use this portal to get topic suggestions and more using the
                    latest in artificial intelligence.
                  </p>
                  <TopicDashboard megaphoneUserInfo={megaphoneUserData?.user} />
                </>
              )}
            </>
          ) : (
            <>
              <Welcome />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
