import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/dashboard/Dashboard';
import Users from './components/users/Users';
import Grievances from './components/grievances/Grievances';
import Work from './components/work/Work';

const ProtectedRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/" />;
};

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/Users" element={<ProtectedRoute element={<Users />} />} />
      <Route path="/Grievances" element={<ProtectedRoute element={<Grievances />} />} />
      <Route path="/Work" element={<ProtectedRoute element={<Work />} />} />
    </Routes>
  );
};

export default AllRoutes;
