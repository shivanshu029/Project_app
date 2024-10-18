import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/register.css'; // Ensure you have this CSS file
import signup_image from '../signup_img.jpg'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
    const [isDriver, setIsDriver] = useState(false);
    const [vehicleType, setVehicleType] = useState('');
    const [currentLocation, setCurrentLocation] = useState('New York City - JFK Airport'); // Default location
    const navigate = useNavigate();
    const [role, setRole] = useState('user');

    const predefinedLocations = ["New York City - JFK Airport",
    "New York City - Times Square",
    "San Francisco - Union Square",
    "San Francisco - SFO Airport",
    "Los Angeles - LAX Airport",
    "Los Angeles - Downtown",
    "Chicago - O'Hare Airport",
    "Chicago - Millennium Park",
    "Boston - Logan Airport",
    "Boston - Harvard Square"]; // List of hardcoded locations

    const handleRegister = async (e) => {
        e.preventDefault();
        try{
        // Check if passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        if(isDriver===true){
            setRole('driver');
        }else if (isDriver===false){
            setRole('user')
        }
        console.log("driver and role",isDriver,role);
        const res = await axios.post('http://localhost:8080/api/users/register', { name, email, password, role });
        const token = res.data.token;  // Assume the token is returned after registration
        console.log(res);
       
    
        // Store the token in localStorage (if needed for future use)
        localStorage.setItem("token", token);
        
        
        // If the user registers as a driver
        if (isDriver) {
            await axios.post('http://localhost:8080/api/drivers/register-driver', {
                vehicleType,
                currentLocation,  // Now passing the selected location from the dropdown
            }, {
                headers: {
                    Authorization: `Bearer ${token}`  // Pass the token in the header
                }
            });
            console.log("Driver registered successfully!");
        }
        toast.success("Registered successfully");
            navigate('/login');
        } catch (error) {
            toast.success("Something went wrong");
            console.log('Registration failed', error);
        }
    };

    return (
        <section className="min-vh-100 " style={{ backgroundColor: '#8fc4b7' }}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-lg-8 col-xl-6">
                        <div className="card rounded-3">
                            <img
                                src={signup_image}
                                className="w-100"
                                style={{ borderTopLeftRadius: '.3rem', borderTopRightRadius: '.3rem' }}
                                alt="Sample photo"
                            />
                            <div className="card-body p-4 p-md-5">
                                <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">Registration Info</h3>
                                <form className="px-md-2" onSubmit={handleRegister}>
                                    <div data-mdb-input-init className="form-outline mb-4">
                                        <input
                                            type="text"
                                            id="form3Example1q"
                                            className="form-control"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                        <label className="form-label" htmlFor="form3Example1q">Name</label>
                                    </div>

                                    <div data-mdb-input-init className="form-outline mb-4">
                                        <input
                                            type="email"
                                            id="form3Example2q"
                                            className="form-control"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <label className="form-label" htmlFor="form3Example2q">Email</label>
                                    </div>

                                    <div data-mdb-input-init className="form-outline mb-4">
                                        <input
                                            type="password"
                                            id="form3Example3q"
                                            className="form-control"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <label className="form-label" htmlFor="form3Example3q">Password</label>
                                    </div>

                                    <div data-mdb-input-init className="form-outline mb-4">
                                        <input
                                            type="password"
                                            id="form3Example4q"
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <label className="form-label" htmlFor="form3Example4q">Confirm Password</label>
                                    </div>

                                    <div className="form-check mb-4">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="isDriver"
                                            checked={isDriver}
                                            onChange={() => setIsDriver(!isDriver)}
                                        />
                                        <label className="form-check-label" htmlFor="isDriver">
                                            Register as Driver
                                        </label>
                                    </div>

                                    {/* Driver-specific fields */}
                                    {isDriver && (
                                        <>
                                           <div data-mdb-input-init className="form-outline mb-4">
    <select
        className="form-control"
        value={vehicleType}
        onChange={(e) => setVehicleType(e.target.value)}
        required
    >
        <option value="" disabled>Select Vehicle Type</option>
        <option value="Car">Car</option>
        <option value="Van">Van</option>
        <option value="Truck">Truck</option>
    </select>
    <label className="form-label">Vehicle Type</label>
</div>


                                            <div className="form-outline mb-4">
                                                <select
                                                    className="form-control"
                                                    value={currentLocation}
                                                    onChange={(e) => setCurrentLocation(e.target.value)}
                                                    required
                                                >
                                                    {predefinedLocations.map(location => (
                                                        <option key={location} value={location}>{location}</option>
                                                    ))}
                                                </select>
                                                <label className="form-label">Select Current Location</label>
                                            </div>
                                        </>
                                    )}

                                    <button
                                        type="submit"
                                        data-mdb-button-init
                                        data-mdb-ripple-init
                                        className="btn btn-success btn-lg mb-1"
                                    >
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
