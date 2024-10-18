import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import login_bg from "../login_bg.jpg"

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]); // Available bookings
  const [acceptedBookings, setAcceptedBookings] = useState([]); // Accepted bookings
  const [deliveredBookings, setDeliveredBookings] = useState([]); // Delivered bookings

  // Fetch available bookings
  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/drivers/available-jobs",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBookings(response.data);
    } catch (error) {
      toast.error("Something went wrong ");
      console.log("Error fetching bookings", error);
    }
  };

  // Fetch delivered bookings
  const fetchDeliveredBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/drivers/delivered",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDeliveredBookings(response.data);
    } catch (error) {
      console.log("Error fetching delivered bookings", error);
    }
  };

  // Handle accepting a booking
  const handleAcceptBooking = async (bookingId) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/drivers/accept-booking",
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Find the accepted booking
      const acceptedBooking = bookings.find((b) => b._id === bookingId);

      if (acceptedBooking) {
        // Move the booking to the accepted bookings list
        setAcceptedBookings((prev) => [...prev, { ...acceptedBooking, status: "Accepted" }]);

        // Remove the accepted booking from the available bookings list
        setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
      }
    } catch (error) {
      console.log("Error accepting booking", error);
    }
  };

  // Handle rejecting a booking
  const handleRejectBooking = (bookingId) => {
    setBookings((prevBookings) =>
      prevBookings.filter((booking) => booking._id !== bookingId)
    );
  };

  // Handle status updates for accepted bookings
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await axios.post(
        "http://localhost:8080/api/drivers/update-status",
        { bookingId, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the status of the booking in accepted bookings
      setAcceptedBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );

      // If the booking is marked as "Delivered", move it to delivered bookings
      if (newStatus === "Delivered") {
        const deliveredBooking = acceptedBookings.find(
          (b) => b._id === bookingId
        );
        setDeliveredBookings((prev) => [
          ...prev,
          { ...deliveredBooking, status: newStatus },
        ]);
        setAcceptedBookings((prev) => prev.filter((b) => b._id !== bookingId));
      }
    } catch (error) {
      console.log("Error updating booking status", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchDeliveredBookings();
  }, []);

  return (
    <div>
      <section
        className="min-vh-100"
        style={{ backgroundColor: "#eee" }}
        id="driverdashboard"
      >
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black" style={{ borderRadius: "25px" }}>
                <div className="card-body p-md-5">

                  {/* Add the image */}
                  <div className="text-center mb-3">
                    <img
                      src={login_bg}
                      alt="Dashboard Banner"
                      className="img-fluid"
                      style={{ borderRadius: "15px", maxWidth: "100%" }}
                    />
                  </div>

                  <h2 className="text-center mb-5">Driver Dashboard</h2>

                  {/* Active Bookings Section */}
                  <h3>Available Bookings</h3>
                  {bookings.length === 0 ? (
                    <p>No active bookings.</p>
                  ) : (
                    <ul className="list-group mb-4">
                      {bookings.map((booking) => (
                        <li className="list-group-item" key={booking._id}>
                          <div className="d-flex justify-content-between">
                            <div>
                              <h5>Pickup: {booking.pickupLocation}</h5>
                              <p>Drop-Off: {booking.dropoffLocation}</p>
                              <p>Vehicle Type: {booking.vehicleType}</p>
                              <p>Price: ${parseFloat(booking.price).toFixed(2)}</p>
                            </div>
                            <div>
                              <button
                                className="btn btn-success me-2"
                                onClick={() => handleAcceptBooking(booking._id)}
                              >
                                Accept
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleRejectBooking(booking._id)}
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Accepted Bookings Section */}
                  {acceptedBookings.length > 0 && (
                    <div>
                      <h3>Active Bookings</h3>
                      <ul className="list-group mb-4">
                        {acceptedBookings.map((booking) => (
                          <li className="list-group-item" key={booking._id}>
                            <div className="d-flex justify-content-between">
                              <div>
                                <h5>Pickup: {booking.pickupLocation}</h5>
                                <p>Drop-Off: {booking.dropoffLocation}</p>
                                <p>Vehicle Type: {booking.vehicleType}</p>
                                <p>Price: ${parseFloat(booking.price).toFixed(2)}</p>
                                <p>Status: {booking.status}</p>
                              </div>
                              <div>
                                {booking.status === "Accepted" && (
                                  <button
                                    className="btn btn-info me-2"
                                    onClick={() =>
                                      handleUpdateStatus(
                                        booking._id,
                                        "Out for Pickup"
                                      )
                                    }
                                  >
                                    Mark as Out for Pickup
                                  </button>
                                )}
                                {booking.status === "Out for Pickup" && (
                                  <button
                                    className="btn btn-info me-2"
                                    onClick={() =>
                                      handleUpdateStatus(
                                        booking._id,
                                        "Goods Collected"
                                      )
                                    }
                                  >
                                    Mark as Goods Collected
                                  </button>
                                )}
                                {booking.status === "Goods Collected" && (
                                  <button
                                    className="btn btn-info me-2"
                                    onClick={() =>
                                      handleUpdateStatus(
                                        booking._id,
                                        "Out for Delivery"
                                      )
                                    }
                                  >
                                    Mark as Out for Delivery
                                  </button>
                                )}
                                {booking.status === "Out for Delivery" && (
                                  <button
                                    className="btn btn-success"
                                    onClick={() =>
                                      handleUpdateStatus(
                                        booking._id,
                                        "Delivered"
                                      )
                                    }
                                  >
                                    Mark as Delivered
                                  </button>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Delivered Bookings Section */}
                  {deliveredBookings.length > 0 && (
                    <div>
                      <h3>Previous Bookings</h3>
                      <ul className="list-group">
                        {deliveredBookings.map((booking) => (
                          <li className="list-group-item" key={booking._id}>
                            <div>
                              <h5>Pickup: {booking.pickupLocation}</h5>
                              <p>Drop-Off: {booking.dropoffLocation}</p>
                              <p>Vehicle Type: {booking.vehicleType}</p>
                              <p>Price: ${parseFloat(booking.price).toFixed(2)}</p>
                              <p>Status: {booking.status}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DriverDashboard;
