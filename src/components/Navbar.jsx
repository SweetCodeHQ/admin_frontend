import { useState, useContext } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { UserContext, CartContext } from "../context/";
import { Cart, Button, CartIcon, BlanketNotification } from "../components";

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
    $acceptedCookiesOn: ISO8601DateTime
    $acceptedEulaOn: ISO8601DateTime
  ) {
    updateUser(
      input: {
        id: $id
        sawBannerOn: $sawBannerOn
        acceptedPrivacyOn: $acceptedPrivacyOn
        acceptedCookiesOn: $acceptedCookiesOn
        acceptedEulaOn: $acceptedEulaOn
      }
    ) {
      id
      sawBannerOn
      acceptedPrivacyOn
      acceptedCookiesOn
      acceptedEulaOn
    }
  }
`;

const Navbar = () => {
  const { handleSignOut, googleUser, megaphoneUserInfo } = useContext(
    UserContext
  );

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
    const attributesArray = [
      "sawBannerOn",
      "acceptedPrivacyOn",
      "acceptedCookiesOn",
      "acceptedEulaOn"
    ];

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

  const TITLES = [
    "News from the Fixate Desk",
    "We've updated our privacy statement.",
    "We've updated our cookie policy.",
    "We've updated our EULA."
  ];

  return (
    <nav className="w-full gradient-bg-purple-welcome fixed z-10">
      <div className="w-full flex justify-between items-center p-4">
        {googleUser && (
          <>
            <Button text={"Logout"} handleClick={handleSignOut} />
            {showBanners()}
            <CartIcon />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
