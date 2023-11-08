import { useState, useContext } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { UserContext } from "../context/";

import {
  Button,
  CartIcon,
  BlanketNotification,
  BasicAlert,
  InboxIcon
} from "../components";

const GET_BANNERS = gql`
  query Banners {
    banners {
      id
      purpose
      text
      link
      updatedAt
    }
  }
`;

const UPDATE_USER_BANNER_DATE = gql`
  mutation UpdateUserBannerDate(
    $id: ID!
    $sawBannerOn: ISO8601DateTime
    $acceptedPrivacyOn: ISO8601DateTime
  ) {
    updateUser(
      input: {
        id: $id
        sawBannerOn: $sawBannerOn
        acceptedPrivacyOn: $acceptedPrivacyOn
      }
    ) {
      id
      sawBannerOn
      acceptedPrivacyOn
    }
  }
`;

const TITLES = [
  "News from the Fixate Desk",
  "We've updated our privacy statement."
];

const Navbar = () => {
  const { handleSignOut, googleUser, megaphoneUserInfo } = useContext(
    UserContext
  );

  const [showBasicAlert, setShowBasicAlert] = useState(false);

  const logUserOut = () => {
    setShowBasicAlert(true);
    handleSignOut();
  };

  const updateUserBannerDate = (id, userAttribute) => {
    const currentDate = new Date(Date.now()).toISOString();

    const input = { id: id, [userAttribute]: currentDate };
    updateUserBannerData({ variables: input });
  };

  const handleDateUpdate = userAttribute => {
    updateUserBannerDate(megaphoneUserInfo.id, userAttribute);
  };

  const [updateUserBannerData, { error: userBannerError }] = useMutation(
    UPDATE_USER_BANNER_DATE,
    {
      onCompleted: data => console.log(data),
      onError: error => console.log(error)
    }
  );

  const showBanners = () => {
    if (!bannersData) return;
    const banners = bannersData.banners.map((banner, i) => {
      return showBanner(banner, i);
    });
    return banners;
  };

  const showBanner = (banner, i) => {
    const attributesArray = ["sawBannerOn", "acceptedPrivacyOn"];

    let bannerSeen = megaphoneUserInfo
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
    onError: error => console.log(error),
    fetchPolicy: "network-only"
  });

  const showLogin = () => {
    const card = document.getElementById("loginCard");
    card.scrollIntoView({ behavior: "smooth" });
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
            <Button text={"Sign Out"} handleClick={logUserOut} />
            {showBanners()}
            <InboxIcon />
            <CartIcon />
          </>
        ) : (
          <>
            <div></div>
            <Button text="Sign In" handleClick={showLogin} />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
