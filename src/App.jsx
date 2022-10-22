import { Navbar, Welcome, Footer, Loader, Dashboard } from "./components";
import { UserContext, UserContextProvider } from "./context/UserContext";
import { useEffect, useState, useContext } from "react";
import { useQuery, gql } from "@apollo/client";

const App = () => {
  const user = useContext(UserContext);

  return (
    <div className="min-h-screen">
      <div className="gradient-bg-purple-welcome">
        <UserContextProvider user={user}>
          <Navbar />
          <Dashboard />
        </UserContextProvider>
        <Footer />
      </div>
    </div>
  );
};
export default App;
