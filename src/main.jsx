import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
     <GoogleOAuthProvider
    clientId="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
  >
      <App /></GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
