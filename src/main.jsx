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
    <GoogleOAuthProvider clientId="370692924501-o701jqakpplacn0r5cohmiv7q6firec5.apps.googleusercontent.com">
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
