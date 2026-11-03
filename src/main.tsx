import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@aws-amplify/ui-react/styles.css"; // <-- CRITICAL: Enables Amplify UI styling
import { Authenticator } from "@aws-amplify/ui-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator>
      <App />
    </Authenticator>
  </React.StrictMode>
);