import React, { useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import jwt_decode from "jwt-decode";

const CREATE_USER = gql`
  mutation createUser($email: String!) {
    createUser(input: { email: $email }) {
      id
      email
      isAdmin
      loginCount
    }
  }
`;

export const UserContext = React.createContext();

export const UserContextProvider = ({ children }) => {
  const [googleUser, setGoogleUser] = useState(() => {
    const saved = localStorage.getItem("googleUser");
    const initialValue = JSON.parse(saved);

    return initialValue || null;
  });

  const [gToken, setGToken] = useState(null);

  const [megaphoneUserInfo, setMegaphoneUserInfo] = useState(() => {
    const saved = localStorage.getItem("megaphoneUser");
    const initialValue = JSON.parse(saved);
    return initialValue || null;
  });

  const createUserMutation = async email => {
    const input = { email: email };
    const data = await userMutationData({ variables: input });
    return data;
  };

  const [userMutationData, { loading, error }] = useMutation(CREATE_USER, {
    onCompleted: data => console.log(data),
    onError: error => console.log(error)
  });

  const userCallback = async response => {
    console.log("logged in");
    var userObject = jwt_decode(response.credential);
    if (userObject.hd) {
      setGoogleUser(userObject);
      await createUserMutation(userObject.email);
      return userObject;
    } else {
      return alert("Please try your corporate G-Suite account.");
    }
    {
      /*Need to reset this to userObject.user. Then, I need to change every mention of user.user  the dashboard.*/
    }
  };

  const handleSignupAlertEmail = userId => {
    const url = `${process.env.MEGAPHONE_DB_URL}/signup_alert_emails?user_id=${userId}`;

    fetch(url, { method: "POST" }).then(error => console.log(error));
  };

  const handleSignOut = event => {
    console.log("logged out");
    setGoogleUser(null);
    setMegaphoneUserInfo(null);
  };

  const localStorageEffects = () => {
    localStorage.setItem("googleUser", JSON.stringify(googleUser));
    localStorage.setItem("megaphoneUser", JSON.stringify(megaphoneUserInfo));
  };

  useEffect(() => {
    localStorageEffects();
  }, [googleUser, megaphoneUserInfo]);

  return (
    <UserContext.Provider
      value={{
        handleSignOut,
        userCallback,
        googleUser,
        megaphoneUserInfo,
        setMegaphoneUserInfo,
        handleSignupAlertEmail,
        createUserMutation,
        gToken,
        setGToken
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
