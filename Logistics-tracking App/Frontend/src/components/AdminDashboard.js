import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement, BarElement } from 'chart.js'; // Import necessary elements
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Button } from 'react-bootstrap'; // Import Button from react-bootstrap
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement, BarElement);

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('bookings');

    // Fetch data from the APIs
    const fetchData = async () => {
        try {
            const bookingResponse = await axios.get('http://localhost:8080/api/admin/bookings');
            setBookings(bookingResponse.data);
            
            const driverResponse = await axios.get('http://localhost:8080/api/admin/drivers');
            setDrivers(driverResponse.data);
            
            const userResponse = await axios.get('http://localhost:8080/api/admin/users');
            setUsers(userResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Logout handler
   // Logout handler
const handleLogout = () => {
    // Clear local storage or session storage
    localStorage.removeItem('token'); // Remove token from local storage
    sessionStorage.removeItem('token'); // Optionally clear session storage if used

    // Redirect to login page
    window.location.href = '/login';
};


    // Prepare data for Booking Status Distribution
    const getBookingStatusData = () => {
        const statusCounts = bookings.reduce((acc, booking) => {
            acc[booking.status] = (acc[booking.status] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(statusCounts),
            datasets: [{
                label: 'Booking Status Distribution',
                data: Object.values(statusCounts),
                backgroundColor: ['#42A5F5', '#66BB6A', '#FFCA28', '#EF5350'],
            }]
        };
    };

    // Prepare data for Price Trends
    const getPriceTrendsData = () => {
        const priceData = bookings.map(booking => ({
            time: new Date(booking.createdAt).toLocaleDateString(),
            price: booking.price
        }));

        return {
            labels: priceData.map(data => data.time),
            datasets: [{
                label: 'Price Over Time',
                data: priceData.map(data => data.price),
                borderColor: '#FF6384',
                fill: false,
            }]
        };
    };

    // Prepare data for Most Preferred Locations
    const getPreferredLocationsData = () => {
        const locationCounts = bookings.reduce((acc, booking) => {
            acc[booking.pickupLocation] = (acc[booking.pickupLocation] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(locationCounts),
            datasets: [{
                label: 'Most Preferred Locations',
                data: Object.values(locationCounts),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            }]
        };
    };

    // Prepare data for Vehicle Type Distribution
    const getVehicleTypeData = () => {
        const vehicleCounts = drivers.reduce((acc, driver) => {
            acc[driver.vehicleType] = (acc[driver.vehicleType] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(vehicleCounts),
            datasets: [{
                label: 'Vehicle Type Distribution',
                data: Object.values(vehicleCounts),
                backgroundColor: ['#4BC0C0', '#FF6384', '#FFCE56', '#36A2EB'],
            }]
        };
    };

    // Prepare data for Current Location Distribution
    const getCurrentLocationData = () => {
        const locationCounts = drivers.reduce((acc, driver) => {
            acc[driver.currentLocation] = (acc[driver.currentLocation] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(locationCounts),
            datasets: [{
                label: 'Current Location Distribution',
                data: Object.values(locationCounts),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            }]
        };
    };

    // Prepare data for User Creation Over Time
    const getUserCreationData = () => {
        const userCreationData = users.reduce((acc, user) => {
            const date = new Date(user.createdAt).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(userCreationData),
            datasets: [{
                label: 'User Creation Over Time',
                data: Object.values(userCreationData),
                borderColor: '#36A2EB',
                fill: false,
            }]
        };
    };

    return (
        <div className="container-fluid mt-5"> {/* Adjusted margin-top to 5 to add space for the fixed navbar */}
            
            {/* Navbar */}
            <Navbar bg="success" variant="dark" expand="lg" className="mb-4 fixed-top" style={{ width: '100%' }}> {/* Set bg to green and occupy full width */}
                <Navbar.Brand href="#home">Admin Dashboard</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link 
                            href="#bookings" 
                            onClick={() => setActiveTab('bookings')}
                            active={activeTab === 'bookings'}
                        >
                            Bookings
                        </Nav.Link>
                        <Nav.Link 
                            href="#drivers" 
                            onClick={() => setActiveTab('drivers')}
                            active={activeTab === 'drivers'}
                        >
                            Drivers
                        </Nav.Link>
                        <Nav.Link 
                            href="#users" 
                            onClick={() => setActiveTab('users')}
                            active={activeTab === 'users'}
                        >
                            Users
                        </Nav.Link>
                    </Nav>
                    <Button variant="outline-light" onClick={handleLogout}>Logout</Button> {/* Added Logout button */}
                </Navbar.Collapse>
            </Navbar>

            {/* Conditionally Render Graphs and Tables */}
            {activeTab === 'bookings' && (
                <div>
                    <h2 className="mt-4">Booking Statistics</h2>
                    <div className="row">
                        <div className="col-md-6">
                            <h5>Booking Status Distribution</h5>
                            <div style={{ maxWidth: '300px', margin: 'auto' }}>
                                <Pie data={getBookingStatusData()} width={300} height={300} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h5>Price Trends Over Time</h5>
                            <Line data={getPriceTrendsData()} />
                        </div>
                    </div>

                    <h2 className="mt-4">Bookings</h2>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Pickup Location</th>
                                <th>Drop off Location</th>
                                <th>Status</th>
                                <th>Vehicle Type</th>
                                <th>Price</th>
                                <th>Booking Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking._id}>
                                    <td>{booking.pickupLocation}</td>
                                    <td>{booking.dropoffLocation}</td>
                                    <td>{booking.status}</td>
                                    <td>{booking.vehicleType}</td>
                                    <td>{booking.price}</td>
                                    <td>{new Date(booking.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'drivers' && (
                <div>
                    <h2 className="mt-4">Driver Statistics</h2>
                    <div className="row">
                        <div className="col-md-6">
                            <h5>Vehicle Type Distribution</h5>
                            <div style={{ maxWidth: '300px', margin: 'auto' }}>
                                <Pie data={getVehicleTypeData()} width={300} height={300} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h5>Current Location Distribution</h5>
                            <Bar data={getCurrentLocationData()} />
                        </div>
                    </div>

                    <h2 className="mt-4">Drivers</h2>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Vehicle Type</th>
                                <th>Current Location</th>
                                <th>Availability</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drivers.map(driver => (
                                <tr key={driver._id}>
                                    <td>{driver.name}</td>
                                    <td>{driver.vehicleType}</td>
                                    <td>{driver.currentLocation}</td>
                                    <td>{driver.isAvailable ? 'Available' : 'Unavailable'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'users' && (
                <div>
                    <h2 className="mt-4">User Statistics</h2>
                    <div className="row">
                        <div className="col-md-6">
                            <h5>User Creation Over Time</h5>
                            <Line data={getUserCreationData()} />
                        </div>
                    </div>

                    <h2 className="mt-4">Users</h2>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
