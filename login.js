import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../css/login.css'; // Ensure you have this CSS file
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const [user, setUser] = useState(''); // This holds the email
    const [password, setPassword] = useState(''); // This holds the password
    const [error, setError] = useState(false); // Error state for validation or login failure
    const [errorMessage, setErrorMessage] = useState(''); // Store error message from API
    const navigate = useNavigate(); // Initialize useNavigate for navigation

    const LogIn = async () => {
        if (user.length < 4 || password.length < 8) {
            setError(true);
            setErrorMessage('Email must be valid and password must be at least 8 characters long.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/users/login', {
                email: user,
                password: password,
            });

            if (response.status === 200) {
                toast.success("Successfully logged in");
                const { token, role } = response.data;

                // Store the token in localStorage (or any other secure method)
                localStorage.setItem('token', token);
                localStorage.setItem('role', role );

                // Redirect based on the userType returned from the API
                if (role === 'user') {
                    navigate('/user-dashboard');
                } else if (role === 'driver') {
                    navigate('/driver-dashboard');
                } else if (role === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    setError(true);
                    setErrorMessage('Invalid user type. Please contact support.');
                    toast.error("Invalid user type")
                }
                
                setError(false);
                setErrorMessage('');
            } else {
                setError(true);
                setErrorMessage('Invalid credentials. Please try again.');
                toast.error("Invalid credentials ")
            }
        } catch (err) {
            setError(true);
            toast.error("Something went wrong");
            setErrorMessage('Error logging in. Please check your credentials or try again later.');
            console.error('Login error:', err);
        }
    };

    const navigateToSignUp = () => {
        navigate('/register');
    };

    return (
        <section className="vh-100">
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    {/* <div className="col-md-9 col-lg-6 col-xl-5">
                        <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                            className="img-fluid"
                            alt="Sample"
                        />
                    </div> */}
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                        <h1 className="mb-4 text-center">Logistics Booking Manager</h1> {/* Main Heading */}
                        <form>
                            <div className="divider d-flex align-items-center my-4">
                                <p className="text-center fw-bold mx-3 mb-0">LogIn</p>
                            </div>

                            {/* Email input */}
                            <div className="form-outline mb-4">
                                <input
                                    type="email"
                                    id="form3Example3"
                                    className="form-control form-control-lg"
                                    placeholder="Enter a valid email address"
                                    value={user}
                                    onChange={(event) => setUser(event.target.value)}
                                />
                                <label className="form-label" htmlFor="form3Example3">Email address</label>
                            </div>

                            {/* Password input */}
                            <div className="form-outline mb-3">
                                <input
                                    type="password"
                                    id="form3Example4"
                                    className="form-control form-control-lg"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                                <label className="form-label" htmlFor="form3Example4">Password</label>
                            </div>

                            {/* Error message */}
                            {error && <div className="alert alert-danger">{errorMessage}</div>}

                            <div className="text-center text-lg-start mt-4 pt-2">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-lg"
                                    onClick={LogIn}
                                    style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                                >
                                    Submit
                                </button>
                                <p className="small fw-bold mt-2 pt-1 mb-0">
                                    Don't have an account? <a href="#!" className="link-danger" onClick={navigateToSignUp}>Register</a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
                {/* Copyright */}
                <div className="text-white mb-3 mb-md-0">
                    Copyright © Logistics Booking Manager
                </div>
                {/* Social Media Links */}
                
            </div>
        </section>
    );
};

export default Login;
