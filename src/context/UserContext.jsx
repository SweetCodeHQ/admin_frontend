import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { callMutation } from '../utils/callMutation';
import { CREATE_USER, UPDATE_LOGIN_COUNT } from '../graphql/mutations'
import jwt_decode from 'jwt-decode';

export const UserContext = React.createContext();

export const UserContextProvider = ({ children }) => {
  const [googleUser, setGoogleUser] = useState(() => {
    const saved = localStorage.getItem('googleUser');
    const initialValue = JSON.parse(saved);

    return initialValue || null;
  });

  const [gToken, setGToken] = useState(null);

  const [megaphoneUserInfo, setMegaphoneUserInfo] = useState(() => {
    const saved = localStorage.getItem('megaphoneUser');
    const initialValue = JSON.parse(saved);
    return initialValue || null;
  });

  const [createUser] = useMutation(CREATE_USER, {
    context: { headers: { authorization: `${process.env.MUTATION_KEY}` } },
    onCompleted: (data) => setMegaphoneUserInfo(data.createUser),
    onError: (error) => console.log(error),
  });

  const [
    updateLoginCount
  ] = useMutation(UPDATE_LOGIN_COUNT, {
    context: { headers: { authorization: `${process.env.MUTATION_KEY}` } },
    onError: (error) => console.log(error)
  });

  const userCallback = async response => {
    console.log("logged in");
    window.dataLayer.push({'event':'login', 'method': 'Google'})
    var userObject = jwt_decode(response.credential);

    if (userObject.hd) {
      setGoogleUser(userObject);
      const userResponse = await callMutation({ email: userObject.email }, createUser)

      return userResponse.data.createUser;
    }
    return alert('Please try your corporate G-Suite account.');
  };

  const handleSignupAlertEmail = (userId) => {
    const url = `${process.env.MEGAPHONE_DB_URL}/signup_alert_emails?user_id=${userId}`;

    fetch(url, { method: 'POST' }).then((error) => console.log(error));
  };

  const handleSignOut = (event) => {
    console.log('logged out');
    setGoogleUser(null);
    setMegaphoneUserInfo(null);
  };

  const localStorageEffects = () => {
    localStorage.setItem('googleUser', JSON.stringify(googleUser));
    localStorage.setItem('megaphoneUser', JSON.stringify(megaphoneUserInfo));
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
        gToken,
        setGToken,
        updateLoginCount
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
