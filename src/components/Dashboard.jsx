import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context";

import {
  TopicDashboard,
  Welcome,
  IndustryModal,
  GoogleLoginButton,
  AdminDashboards,
  Tour
} from "../components";

import { gql, useQuery, useMutation } from "@apollo/client";

import loggedInBackground from "../assets/WelcomeBG.png";
import landingBackground from "../assets/climbing.png";

const GET_USER_PROFILE = gql`
  query userByEmail($email: String!) {
    user(email: $email) {
      id
      email
      isAdmin
      loginCount
      clickedGenerateCount
      topicCount
      industry
      onboarded
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

const UPDATE_LOGIN_COUNT = gql`
  mutation UpdateLoginCount($id: ID!) {
    updateUser(input: { id: $id, loginCount: 1 }) {
      id
      loginCount
    }
  }
`;

const Dashboard = () => {
  const {
    handleSignOut,
    userCallback,
    setMegaphoneUserInfo,
    handleSignupAlertEmail
  } = useContext(UserContext);

  const [toggleIndustryModal, setToggleIndustryModal] = useState(false);

  const googleUser = useContext(UserContext);
  const email = googleUser?.googleUser?.email;
  const userHd = googleUser?.googleUser?.hd;

  const { data: megaphoneUserData, refetch: refetchUser } = useQuery(
    GET_USER_PROFILE,
    {
      variables: { email },
      onError: error => console.log(error)
    }
  );

  const [openTour, setOpenTour] = useState(false);

  useEffect(() => {
    if (megaphoneUserData && !megaphoneUserData?.user.onboarded)
      setOpenTour(true);
  }, [megaphoneUserData]);

  const { data: entityData, refetch: refetchEntity } = useQuery(GET_ENTITY, {
    variables: { url: userHd },
    onError: error => console.log(error),
    onCompleted: data => console.log(data)
  });

  const updateUserLoginCount = id => {
    const input = { id: id };
    updateLoginCountMutationData({ variables: input });
  };
  {
    /*Pull this back into the userContext*/
  }
  const [
    updateLoginCountMutationData,
    { loading: loginLoading, error: loginError }
  ] = useMutation(UPDATE_LOGIN_COUNT, {
    onCompleted: data => console.log(data),
    onError: error => console.log(error)
  });

  const loginCallback = async response => {
    const currentUser = await userCallback(response);
    userEntityCallback(currentUser);
  };

  const megaphoneUserRefetch = async mail => {
    const user = refetchUser({ email: mail });
    return user;
  };

  const userEntityCallback = async currentUser => {
    const data = await megaphoneUserRefetch(currentUser.email);

    if (data.data.user.loginCount === 0)
      handleSignupAlertEmail(data.data.user.id);
    setMegaphoneUserInfo(data.data.user);
    updateUserLoginCount(data.data.user.id);

    const megaphoneEntityResponse = await refetchEntity({
      url: currentUser.hd
    });

    const entityId = megaphoneEntityResponse.data.entity.id;

    createUserEntityMutation(data.data.user.id, entityId);
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

  const background = googleUser?.googleUser
    ? { backgroundImage: `url(${loggedInBackground})` }
    : { backgroundImage: `url(${landingBackground})` };

  const userIsLoggedInAndIsAdmin =
    googleUser?.googleUser && megaphoneUserData?.user?.isAdmin;

  const userIsLoggedInAndIsNotAdmin =
    googleUser?.googleUser && !megaphoneUserData?.user?.isAdmin;

  return (
    <div
      className="flex w-full justify-center items-center bg-cover bg-center"
      style={background}
    >
      <div className="flex items-start justify-between md:p-20 py-12">
        <div className="flex flex-1 justify-start flex-col mf:mr-10">
          {!googleUser.googleUser && (
            <>
              <GoogleLoginButton loginCallback={loginCallback} />
              <Welcome />
            </>
          )}
          {googleUser?.googleUser && (
            <h1 className="text-3xl sm:text-5xl text-white text-gradient font-bold py-1">
              Welcome back, <br />
              {googleUser?.googleUser?.given_name}!
            </h1>
          )}
          {megaphoneUserData?.user.industry === 0 &&
          megaphoneUserData?.user?.onboarded ? (
            <IndustryModal
              setToggleIndustryModal={setToggleIndustryModal}
              megaphoneUserId={megaphoneUserData?.user.id}
            />
          ) : null}
          <Tour
            userId={megaphoneUserData?.user.id}
            openTour={openTour}
            setOpenTour={setOpenTour}
          />
          {userIsLoggedInAndIsAdmin && <AdminDashboards />}
          {userIsLoggedInAndIsNotAdmin && (
            <TopicDashboard megaphoneUserInfo={megaphoneUserData?.user} />
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
