import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./styles.css";
console.log(
  "Google Client ID:",
  import.meta.env.VITE_GOOGLE_CLIENT_ID
);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
   <GoogleOAuthProvider clientId="1064507568780-r2qfukp2fvdll7ahpkgklqlimbbusc1k.apps.googleusercontent.com">
    
      <BrowserRouter>
        <App />
        
      </BrowserRouter>
      
    </GoogleOAuthProvider>
  </React.StrictMode>
  
);