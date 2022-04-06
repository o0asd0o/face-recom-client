import React from "react";
import { CssBaseline } from "@mui/material";
import GlobalStyles from "./GlobalStyles";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

ReactDOM.render(
  <>
    <GlobalStyles />
    <CssBaseline />
    <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools />
    </QueryClientProvider>
    </AuthProvider>
  </>,
  document.getElementById("root")
);
