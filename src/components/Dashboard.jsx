import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context';
import { callMutation } from '../utils/callMutation';

import {
  TopicDashboard,
  Welcome,
  IndustryModal,
  AdminDashboards,
  Tour
} from '.';

import loggedInBackground from '../assets/WelcomeBG.png';
import landingBackground from '../assets/climbing.png';
import curioLogoTagline from '../assets/curioLogoTagline.png'

const Dashboard = () => {
  const { userCallback, handleSignupAlertEmail, updateLoginCount, megaphoneUserInfo } =
  useContext(UserContext);
  const googleUser = useContext(UserContext);
  
  const [openTour, setOpenTour] = useState(false);

  const gUser = googleUser?.googleUser
  const mUser = megaphoneUserInfo

  useEffect(() => {
    if (mUser && !mUser?.onboarded) setOpenTour(true);
    if (mUser?.onboarded) moveToTop();
  }, [megaphoneUserInfo]);

  const loginCallback = async (response) => {
    const currentUser = await userCallback(response);

    if (currentUser.loginCount === 0) handleSignupAlertEmail(currentUser.id);

    callMutation({ id: currentUser.id }, updateLoginCount);
  };

  const moveToTop = () => {
    const bar = document.getElementById('titleCard');
    bar?.scrollIntoView(false);
  };

  const background = mUser
    ? { backgroundImage: `url(${loggedInBackground})` }
    : { backgroundImage: `url(${landingBackground})` };

  const userIsLoggedInAndIsAdmin =
    mUser && mUser?.isAdmin;

  const userIsLoggedInAndIsNotAdmin =
    mUser && !mUser?.isAdmin;

  return (
    <div
      className={`flex w-full justify-center items-center ${
        mUser ? 'bg-cover' : null
      }`}
      style={background}
    >
      <div
        className={`${
          mUser ? 'md:p-20' : null
        } flex items-start justify-between py-20`}
      >
        <div className="flex flex-1 justify-start flex-col">
          {!mUser && <Welcome loginCallback={loginCallback} />}
          {mUser && (
            <>
              <img src={curioLogoTagline} className="w-[350px] mb-5 self-center mt-5 md:hidden" />
              <h1
                className="text-3xl sm:text-5xl text-white text-gradient font-bold pt-7 ml-5"
                id="titleCard"
              >
                Welcome back, <br />
                {gUser?.given_name}!
              </h1>
            </>
          )}
          {mUser?.industry === 0 &&
          mUser?.onboarded ? (
            <IndustryModal
              userId={mUser?.id}
            />
          ) : null}
          <Tour
            userId={mUser?.id}
            openTour={openTour}
            setOpenTour={setOpenTour}
          />
          {userIsLoggedInAndIsAdmin && <AdminDashboards userId={mUser.id} /> }
          {userIsLoggedInAndIsNotAdmin && (
            <TopicDashboard userId={mUser.id} userIndustry={mUser.industry} />
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
