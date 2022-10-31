import React, { useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import jwt_decode from "jwt-decode";

const CREATE_USER = gql`
  mutation createUser($email: String!) {
    createUser(input: { email: $email }) {
      id
      email
      isAdmin
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

  const createUserMutation = email => {
    const input = { email: email };
    userMutationData({ variables: input });
  };

  const [userMutationData, { loading, error }] = useMutation(CREATE_USER, {
    onCompleted: data => console.log(data),
    onError: error => console.log(error)
  });

  const userCallback = response => {
    console.log("logged in");
    var userObject = jwt_decode(response.credential);
    if (userObject.hd) {
      setGoogleUser(userObject);

      createUserMutation(userObject.email);
      return userObject;
    } else {
      return alert("Please try your corporate G-Suite account.");
    }
    {
      /*Need to reset this to userObject.user. Then, I need to change every mention of user.user  the dashboard.*/
    }
  };

  const handleSignOut = event => {
    console.log("logged out");
    setGoogleUser(null);
  };

  useEffect(() => {
    localStorage.setItem("googleUser", JSON.stringify(googleUser));
  }, [googleUser]);

  return (
    <UserContext.Provider
      value={{
        handleSignOut,
        userCallback,
        googleUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
