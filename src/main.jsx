import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { AudioProvider } from "./contexts";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AudioProvider>
      <App />
    </AudioProvider>
  </React.StrictMode>
);
