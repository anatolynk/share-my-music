import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { ApolloProvider, useQuery, gql } from "@apollo/client";

import client from "./graphql/client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <Toaster position='top-center' reverseOrder={false} />
    </ThemeProvider>
  </ApolloProvider>
);
