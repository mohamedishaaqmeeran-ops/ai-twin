import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./styles.css";

const GOOGLE_CLIENT_ID =
  "1064507568780-r2qfukp2fvdll7ahpkglkqlimbbusc1k.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);