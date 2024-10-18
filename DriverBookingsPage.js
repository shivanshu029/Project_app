// DriverBookingsPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DriverBookingsPage = () => {
    const [deliveredBookings, setDeliveredBookings] = useState([]);

    // Fetch delivered bookings
    const fetchDeliveredBookings = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/drivers/delivered', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setDeliveredBookings(response.data);
        } catch (error) { 
            toast.error("Something went wrong")
            console.log("Error fetching delivered bookings", error);
        }
    };

    useEffect(() => {
        fetchDeliveredBookings();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center">Delivered Bookings</h1>
            <table className="table table-striped mt-4">
                <thead>
                    <tr>
                        <th>Pickup Location</th>
                        <th>Dropoff Location</th>
                        <th>Status</th>
                        <th>Vehicle Type</th>
                        <th>Price $</th>
                        <th>Delivery Time</th>
                    </tr>
                </thead>
                <tbody>
                    {deliveredBookings.map(booking => (
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
    );
};

export default DriverBookingsPage;
