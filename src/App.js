import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/Login/LoginPage";
import Home from "./Pages/Home/Home.jsx";
import AddProject from "./Pages/AddProject/AddProject.jsx";
import Project from "./Pages/Project/Project.jsx";
import BillingPeriods from "./Pages/BillingPeriods/BillingPeriods.jsx";
import EditProjectForm from "./Pages/EditProject/EditProjectForm/EditProjectForm.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Default route */}
        <Route path="/home" element={<Home />} /> {/* Protected Home route */}
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/project/:id" element={<Project />} />
        <Route
          path="/project/:id/billing-periods"
          element={<BillingPeriods />}
        />
        <Route path="/project/:id/edit" element={<EditProjectForm />} />
      </Routes>
    </Router>
  );
};

export default App;
