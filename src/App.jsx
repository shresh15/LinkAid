import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Components/LandingPage";

import Issues from "./Components/issues";
import Solution from "./Components/Solution";
import Details from "./Components/Details";
import AuthPage from "./Components/Authpage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/details" element={<Details />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/solution" element={<Solution />} />
      </Routes>
    </>
  );
};

export default App;
