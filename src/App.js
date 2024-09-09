import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/Login/LoginPage";
import Home from "./Pages/Home/Home.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Default route */}
        <Route path="/home" element={<Home />} /> {/* Protected Home route */}
      </Routes>
    </Router>
  );
};

export default App;
