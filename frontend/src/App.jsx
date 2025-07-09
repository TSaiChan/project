// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

// ✅ Import axios configuration (this must be imported early)
import './config/axios';

import HomePage from './components/HomePage';
import Login from "./components/Login";
import Register from "./components/RegistrationPage";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/user_dashboard/UserDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
      <Route path="/user-dashboard/*" element={<UserDashboard />} />
    </Routes>
  );
}

export default App;