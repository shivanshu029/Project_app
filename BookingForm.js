import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import imgbookingpage from "../logistics_img.png";
import "react-toastify/dist/ReactToastify.css";

const BookingPage = ({ username }) => {
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropOffLocation] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  const [price, setPrice] = useState(0);
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  const locations = [
    "New York City - JFK Airport",
    "New York City - Times Square",
    "San Francisco - Union Square",
    "San Francisco - SFO Airport",
    "Los Angeles - LAX Airport",
    "Los Angeles - Downtown",
    "Chicago - O'Hare Airport",
    "Chicago - Millennium Park",
    "Boston - Logan Airport",
    "Boston - Harvard Square",
  ];

  const calculatePrice = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/bookings/price-estimate', {
        pickupLocation,
        dropoffLocation,
        vehicleType,
      });
      const formattedPrice = parseFloat(res.data.price).toFixed(3);

      setPrice(formattedPrice);
      toast.success("Click on Book to confirm")
      setShowModal(true); // Show the modal after calculating price
    } catch (error) {
      toast.error("Error calculating Price")
      console.log("Error calculating price", error);
      //toast.error("Error calculating price. Please try again.");
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Post booking data to the backend with the Authorization header
      await axios.post(
        'http://localhost:8080/api/bookings/book',
        {
          pickupLocation,
          dropoffLocation,
          vehicleType,
          price,
        },
        {
          headers: {
            // Send the token in the Authorization header
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success("Booking created successfully!");
      navigate("/bookings"); // Navigate to the dashboard after successful booking
    } catch (error) {
      console.log("Error creating booking", error);
      toast.error("Error creating booking. Please try again.");
    }
  };

  // Close modal handler
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <section
        className="vh-100"
        style={{ backgroundColor: "#eee" }}
        id="bookingsection"
      >
        <div className="fluid-container vw-100 h-100 bg-dark">
          <div className="row d-flex justify-content-center align-items-center min-vh-100 bg-dark">
            <div className="col-lg-12 col-xl-11 bg-dark">
              <div className="card text-black" style={{ borderRadius: "25px" }}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                        Book a Ride
                      </p>

                      <form onSubmit={handleBooking} className="mx-1 mx-md-4">
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-map-marker-alt fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <label className="form-label">Pickup Location</label>
                            <select
                              value={pickupLocation}
                              onChange={(e) => setPickupLocation(e.target.value)}
                              className="form-control"
                              required
                            >
                              <option value="" disabled>Select Pickup Location</option>
                              {locations.map((location, index) => (
                                <option key={index} value={location}>
                                  {location}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-map-marker-alt fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <label className="form-label">Drop-Off Location</label>
                            <select
                              value={dropoffLocation}
                              onChange={(e) => setDropOffLocation(e.target.value)}
                              className="form-control"
                              required
                            >
                              <option value="" disabled>Select Drop-Off Location</option>
                              {locations.map((location, index) => (
                                <option key={index} value={location}>
                                  {location}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-car fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <label className="form-label me-3">Select Vehicle Type</label>
                            <select
                              value={vehicleType}
                              onChange={(e) => setVehicleType(e.target.value)}
                              className="form-control"
                            >
                              <option value="Car">Car</option>
                              <option value="Van">Van</option>
                              <option value="Truck">Truck</option>
                            </select>
                          </div>
                        </div>

                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <button
                            type="button"
                            className="btn btn-info btn-lg"
                            onClick={calculatePrice}
                          >
                            Estimate Price
                          </button>
                        </div>

                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <button type="submit" className="btn btn-success btn-lg">
                            Book Now
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex-row align-items-center order-1 order-lg-2">
                      <h4>Booking Info</h4>
                      <p>• For Car, the cost is  0.10 $/km.</p>
                      <p>• For Van, the cost is 0.18 $/km</p>
                      <p>• For Truck, the cost is 0.24 $/km</p>
                      <img
                        src={imgbookingpage}
                        class="img-fluid"
                        alt="Sample image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for showing estimated price */}
      {showModal && (
  <div
    style={{
      position: "fixed",
      zIndex: 1,
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        width: "300px", // Smaller width
        textAlign: "center", // Center the text inside
        position: "relative",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "10px",
          right: "20px",
          cursor: "pointer",
          fontSize: "18px",
        }}
        onClick={closeModal}
      >
        &times;
      </span>
      <h4>Estimated Price: ${price}</h4>
    </div>
  </div>
)}

    </div>
  );
};

// Modal Styles (you can adjust based on design requirements)
const modalStyle = {
  position: "fixed",
  zIndex: 1,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  overflow: "auto",
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default BookingPage;
