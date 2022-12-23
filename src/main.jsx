import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";

import { GoogleOAuthProvider } from "@react-oauth/google";

const client = new ApolloClient({
  uri: "https://megaphone-api.herokuapp.com/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          comments: relayStylePagination()
        }
      }
    }
  })
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
