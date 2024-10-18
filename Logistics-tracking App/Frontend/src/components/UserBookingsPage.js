import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/bookings/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        toast.error("something went wrong");
        console.error("Error fetching bookings", err);
        setError("Failed to load bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Navigate back to the booking page
  const handleBack = () => {
    navigate("/user-dashboard");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Your Bookings</h1>
      <button className="btn btn-primary mb-4" onClick={handleBack}>
        Book a New Ride
      </button>
      <div className="row">
        {bookings.length === 0 ? (
          <div className="col text-center">
            <p>No bookings found.</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <p className="card-text">
                    <strong>Pickup Location:</strong> {booking.pickupLocation}
                  </p>
                  <p className="card-text">
                    <strong>Drop-Off Location:</strong> {booking.dropoffLocation}
                  </p>
                  <p className="card-text">
                    <strong>Status:</strong> {booking.status}
                  </p>
                  <p className="card-text">
                    <strong>Price:</strong> ${booking.price}
                  </p>
                  <p className="card-text">
                    <strong>Created At:</strong> {new Date(booking.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserBookingsPage;
