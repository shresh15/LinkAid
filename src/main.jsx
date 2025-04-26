import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AuthContextProvider from "./Components/Context/Auth.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  
    <BrowserRouter>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </BrowserRouter>
  
);
