import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import SignUpPage from "./components/SignUpPage";
import SignInPage from "./components/SignInPage";
import VerifyEmailPage from "./components/VerifyEmailPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route
          path="/sign-up/verify-email-address"
          element={<VerifyEmailPage />}
        />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
