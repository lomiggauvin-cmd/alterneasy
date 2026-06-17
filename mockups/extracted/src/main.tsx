import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import AppContainer from "./components/AppContainer";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppContainer />
    <Toaster position="bottom-center" />
  </React.StrictMode>
);
