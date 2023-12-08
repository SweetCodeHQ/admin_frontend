import { useState, useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_BANNERS } from '../graphql/queries';
import { UPDATE_USER_BANNER_DATE } from '../graphql/mutations'
import { UserContext } from '../context';

import {
  Button,
  CartIcon,
  BlanketNotification,
  BasicAlert,
  InboxIcon,
} from '.';

const TITLES = [
  'News from the Fixate Desk',
  "We've updated our privacy statement.",
];

const Navbar = () => {
  const { handleSignOut, googleUser, megaphoneUserInfo } =
    useContext(UserContext);

  const [showBasicAlert, setShowBasicAlert] = useState(false);

  const logUserOut = () => {
    setShowBasicAlert(true);
    handleSignOut();
  };

  const updateUserBannerDate = (id, userAttribute) => {
    const currentDate = new Date(Date.now()).toISOString();

    const input = { id, [userAttribute]: currentDate };
    updateUserBannerData({ variables: input });
  };

  const handleDateUpdate = (userAttribute) => {
    updateUserBannerDate(megaphoneUserInfo.id, userAttribute);
  };

  const [updateUserBannerData, { error: userBannerError }] = useMutation(
    UPDATE_USER_BANNER_DATE,
    {
      context: { headers: { authorization: `${process.env.MUTATION_KEY}`, user: megaphoneUserInfo?.id } },
      onCompleted: (data) => console.log(data),
      onError: (error) => console.log(error),
    }
  );

  const showBanners = () => {
    if (!bannersData) return;
    const banners = bannersData.banners.map((banner, i) =>
      showBanner(banner, i)
    );
    return banners;
  };

  const showBanner = (banner, i) => {
    const attributesArray = ['sawBannerOn', 'acceptedPrivacyOn'];

    const bannerSeen = megaphoneUserInfo
      ? banner?.updatedAt < megaphoneUserInfo[attributesArray[banner.id - 1]]
      : null;

    if (!bannerSeen)
      return (
        <BlanketNotification
          key={i}
          displayTitle={TITLES[banner.id - 1]}
          link={banner.link}
          displayText={banner.text}
          mutation={() => handleDateUpdate(attributesArray[banner.id - 1])}
        />
      );
  };

  const { data: bannersData } = useQuery(GET_BANNERS, {
    context: { headers: { authorization: `${process.env.QUERY_KEY}`, user: megaphoneUserInfo?.id } },
    onError: (error) => console.log(error),
    fetchPolicy: 'network-only',
  });

  const showLogin = () => {
    const card = document.getElementById('loginCard');
    card.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="w-full gradient-bg-purple-welcome fixed z-10">
      <div className="w-full flex justify-between items-center p-4" id="navBar">
        <BasicAlert
          showBasicAlert={showBasicAlert}
          setShowBasicAlert={setShowBasicAlert}
          text="You have been signed out."
        />
        {googleUser ? (
          <>
            <Button text="Sign Out" handleClick={logUserOut} />
            {showBanners()}
            {/* <InboxIcon /> */}
            <CartIcon isAdmin={megaphoneUserInfo?.isAdmin} />
          </>
        ) : (
          <>
            <div />
            <Button text="Sign In" handleClick={showLogin} />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
