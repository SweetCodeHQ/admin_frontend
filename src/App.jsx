import {
  Navbar,
  Welcome,
  Footer,
  Services,
  Loader,
  Dashboard
} from "./components";
import { UserContext, UserContextProvider } from "./context/UserContext";
import { useEffect, useState, useContext } from "react";
import jwt_decode from "jwt-decode";
import { useQuery, gql } from "@apollo/client";

const App = () => {
  const user = useContext(UserContext);

  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <UserContextProvider user={user}>
          <Navbar />
          <Dashboard />
        </UserContextProvider>
        {/*<div id="signInDiv">GoogleButton</div>
        // {user && (
        //   <div>
        //     <h3>{user.name}</h3>
        //   </div>
        // )}
        <button type="button" onClick={e => handleSignOut(e)}>
          Sign Out
        </button>*/}
        {/*<Welcome /> <Login /> */}
      </div>
      {/*<Services />*/}
      <Footer />
    </div>
  );
};
export default App;
