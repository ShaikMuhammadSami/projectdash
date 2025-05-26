import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';

function App() {
  const isLoggedIn = true; // Replace with actual auth state
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={isLoggedIn ? <Dashboard /> : <Navigate to='/' />} />
        <Route path='/admin' element={isLoggedIn ? <AdminPanel /> : <Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;