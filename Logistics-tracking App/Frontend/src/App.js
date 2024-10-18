import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import BookingForm from './components/BookingForm';
import DriverDashboard from './components/DriverDashboard';
import AdminDashboard from './components/AdminDashboard';
import UserBookingsPage from './components/UserBookingsPage';
import Navbar from './components/navbar';
import DriverBookingsPage from './components/DriverBookingsPage';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    const username = "JohnDoe";

    return (
        <div>
        <Router>
            <div>
                <Navbar username={username} />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Private Routes */}
                    <Route path="/" element={<PrivateRoute><h1>Home Page</h1></PrivateRoute>} />
                    <Route path="/user-dashboard" element={<PrivateRoute><BookingForm /></PrivateRoute>} />
                    <Route path="/driver-dashboard" element={<PrivateRoute><DriverDashboard /></PrivateRoute>} />
                    <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                    <Route path="/bookings" element={<PrivateRoute><UserBookingsPage /></PrivateRoute>} />
                    <Route path="/driver-bookings" element={<PrivateRoute><DriverBookingsPage /></PrivateRoute>} />
                </Routes>
            </div>
        </Router>
        <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      </div>
    );
};

export default App;
