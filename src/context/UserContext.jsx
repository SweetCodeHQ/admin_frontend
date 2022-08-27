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
    handleCallbackResponse(response);

    var email = jwt_decode(response.credential).email;
    createUserMutation(email);
  };
  const handleCallbackResponse = response => {
    console.log("logged in");
    var userObject = jwt_decode(response.credential);
    setUser(userObject);
    {
      document.getElementById("signInDiv").hidden = true;
    }
  };

  const handleSignOut = event => {
    console.log("logged out");
    setUser(null);
    {
      document.getElementById("signInDiv").hidden = false;
    }
  };

  useEffect(() => {
    {
      /*global google*/
    }
    google?.accounts.id.initialize({
      client_id:
        "370692924501-o701jqakpplacn0r5cohmiv7q6firec5.apps.googleusercontent.com",
      callback: userCallback
    });

    google?.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large"
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        handleCallbackResponse,
        handleSignOut,
        user
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
