import React, { useContext, useEffect, useState } from "react";
import { UserContext, EntityContext } from "../context";

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
      acceptedEulaOn
      acceptedCookiesOn
      acceptedPrivacyOn
      sawBannerOn
      entities {
        id
        name
        url
        credits
        requestInProgress
      }
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
      url
      credits
      requestInProgress
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

  const { sendEntity } = useContext(EntityContext);

  const [toggleIndustryModal, setToggleIndustryModal] = useState(false);

  const googleUser = useContext(UserContext);
  const email = googleUser?.googleUser?.email;
  const userHd = googleUser?.googleUser?.hd;

  const { data: megaphoneUserData, refetch: refetchUser } = useQuery(
    GET_USER_PROFILE,
    {
      variables: { email },
      onCompleted: data => setMegaphoneUserInfo(data.user),
      onError: error => console.log(error)
    }
  );

  const [openTour, setOpenTour] = useState(false);

  useEffect(() => {
    if (megaphoneUserData && !megaphoneUserData?.user?.onboarded)
      setOpenTour(true);
  }, [megaphoneUserData]);

  const { data: entityData, refetch: refetchEntity } = useQuery(GET_ENTITY, {
    variables: { url: userHd },
    onError: error => console.log(error),
    onCompleted: data => console.log(data),
    fetchPolicy: "network-only"
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

  const handleEntityCreation = async url => {
    const promise = await sendEntity({ url: url });
    return promise;
  };

  const userEntityCallback = async currentUser => {
    const userData = await megaphoneUserRefetch(currentUser.email);

    if (userData?.data?.user?.loginCount === 0)
      handleSignupAlertEmail(userData?.data?.user?.id);
    setMegaphoneUserInfo(userData?.data?.user);
    updateUserLoginCount(userData?.data?.user?.id);

    const megaphoneEntityResponse = await refetchEntity({
      url: currentUser.hd
    });

    let entityId;

    if (megaphoneEntityResponse.data.entity) {
      entityId = megaphoneEntityResponse.data.entity.id;
    } else {
      const promise = await handleEntityCreation(currentUser.hd);
      entityId = promise.data.createEntity.id;
    }

    if (!userData.data.user.entities[0])
      createUserEntityMutation(userData.data.user.id, entityId);
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
      className={`flex w-full justify-center items-center ${
        googleUser.googleUser ? "bg-cover" : null
      }`}
      style={background}
    >
      <div
        className={`${
          googleUser.googleUser ? "md:p-20" : null
        } flex items-start justify-between py-20`}
      >
        <div className="flex flex-1 justify-start flex-col">
          {!googleUser.googleUser && (
            <>
              <Welcome loginCallback={loginCallback} />
            </>
          )}
          {googleUser?.googleUser && (
            <h1 className="text-3xl sm:text-5xl text-white text-gradient font-bold pt-7">
              Welcome back, <br />
              {googleUser?.googleUser?.given_name}!
            </h1>
          )}
          {megaphoneUserData?.user?.industry === 0 &&
          megaphoneUserData?.user?.onboarded ? (
            <IndustryModal
              setToggleIndustryModal={setToggleIndustryModal}
              megaphoneUserId={megaphoneUserData?.user.id}
            />
          ) : null}
          <Tour
            userId={megaphoneUserData?.user?.id}
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
