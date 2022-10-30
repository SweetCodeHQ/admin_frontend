import { Navbar, Welcome, Footer, Loader, Dashboard } from "./components";
import { UserContextProvider } from "./context/UserContext";

import { CartContextProvider } from "./context/CartContext";

import { useEffect, useState, useContext } from "react";
import { useQuery, gql } from "@apollo/client";

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-purple-welcome">
        <UserContextProvider>
          <CartContextProvider>
            <Navbar />
            <Dashboard />
          </CartContextProvider>
        </UserContextProvider>
        <Footer />
      </div>
    </div>
  );
};
export default App;
