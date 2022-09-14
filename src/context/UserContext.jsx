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
  const [user, setUser] = useState(null);

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
    setUser(userObject);

    createUserMutation(userObject.email);
    {
      /*Need to reset this to userObject.user. Then, I need to change every mention of user.user on dashboard.*/
    }
    return userObject;
  };

  const handleSignOut = event => {
    console.log("logged out");
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        handleSignOut,
        userCallback,
        user
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
