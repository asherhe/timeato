import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/app";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import "./css/index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

serviceWorkerRegistration.register();
