import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import icon_image from '../user.png';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = ({ username }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  // Function to determine whether to show the navbar on specific routes
  const shouldHideNavbar = () => {
    const hiddenRoutes = ["/", "/admin-dashboard", "/register", "/login", "/*"];
    return hiddenRoutes.includes(location.pathname);
  };

  // Handle logout action
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Successfully Logged Out")
    navigate("/login");
  };

  // Fetch user role (driver or user) from localStorage or API
  useEffect(() => {
    const storedRole = localStorage.getItem("role"); // Fetch from localStorage
    if (storedRole) {
      setRole(storedRole);  // Set role as the string "driver" or "user"
    }
  }, []);

  if (shouldHideNavbar()) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow">
      <div className="container-fluid">
        <Link className="navbar-brand" to={role === "driver" ? "/driver-dashboard" : "/user-dashboard"}>
          Logistics Tracker
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to={role === "driver" ? "/driver-dashboard" : "/user-dashboard"}>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={role === "driver" ? "/driver-bookings" : "/bookings"}>
                Bookings
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-white" onClick={handleLogout}>
                Log Out
              </button>
            </li>
          </ul>
          
          <div className="d-flex align-items-right">
  <span className="navbar-text" style={{ marginRight: '10px' }}>Logged in</span>
</div>
          <div nav-item>
              <img
                className="nav-link"
                src={icon_image}
                alt="user"
                style={{ height: "40px" }}
              />
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
