const express = require('express');
const Driver = require('../models/driver');
const Booking = require('../models/booking');
const User = require('../models/users');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Driver
router.post('/register-driver', async (req, res) => {
    const { vehicleType, currentLocation } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];



    try {
        const decoded = jwt.decode(token); // Decode the token to extract driverId
        const userId = decoded.id; 
        // Check if user exists and is a driver
        const user = await User.findById(userId);
        if (!user || user.role !== 'driver') {
            return res.status(400).json({ message: "Invalid driver account" });
        }        

        const driver = new Driver({
            userId,
            vehicleType,
            currentLocation,
        });

        await driver.save();
        res.json({ message: "Driver registered successfully", driver });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// Get available bookings for a driver (within proximity)

router.get('/available-jobs', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];


    try {
        const decoded = jwt.decode(token); // Decode the token to extract driverId
        const driverId = decoded.id; // Assuming the driver's ID is stored in the token as 'id'
        console.log(decoded);
        // Fetch the driver based on the decoded ID from the token
        const driver = await Driver.findOne({ userId: driverId });
        if (!driver ) {
            return res.status(400).json({ message: "Driver is not available" });
        }


        // Fetch available bookings based on hardcoded locations and vehicle type
        const availableBookings = await Booking.find({
            status: 'Pending',
         //   vehicleType: driver.vehicleType,
            pickupLocation: driver.currentLocation 
        });

        res.json(availableBookings);
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
});

// Accept a booking

router.post('/accept-booking', async (req, res) => {
    const { bookingId } = req.body;

    // Extract driverId from the token
    const token = req.headers.authorization.split(' ')[1]; // Get the token
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.decode(token); // Replace 'your_jwt_secret' with your actual secret
        const driverId = decoded.id; // Extract driverId from the token

        const booking = await Booking.findById(bookingId);
        if (!booking || booking.status !== 'Pending') {
            return res.status(400).json({ message: "Invalid or already accepted booking" });
        }
        console.log(driverId);

        // Assign driver to the booking
        booking.driver = driverId;
        booking.status = 'Accepted';
        await booking.save();

        // Mark driver as unavailable
        await Driver.findByIdAndUpdate(driverId, { available: false });

        res.json({ message: "Booking accepted", booking });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update job status (e.g., 'en route', 'goods collected', 'delivered')
router.post('/update-status', async (req, res) => {
    const { bookingId, status } = req.body;
    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(400).json({ message: "Invalid booking ID" });
        }

        // Update booking status
        booking.status = status;
        await booking.save();

        res.json({ message: `Booking status updated to ${status}`, booking });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/delivered', async (req, res) => {
    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        // Decode the token to get the driverId
        const decoded = jwt.decode(token);
        const driverId = decoded.id;
        console.log(driverId);

        // Query the database for bookings where the driverId matches and status is 'delivered'
        const deliveredBookings = await Booking.find({ driver: driverId, status: 'Delivered' });

        // Return the delivered bookings
        res.json(deliveredBookings);
    } catch (err) {
        console.error('Error fetching delivered bookings:', err);
        res.status(500).json({ message: "Server error" });
    }
});

// Update driver's current location
router.post('/location-update', async (req, res) => {
    const { driverId, currentLocation } = req.body;
    try {
        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(400).json({ message: "Invalid driver ID" });
        }

        // Update driver's location
        driver.currentLocation = currentLocation;
        await driver.save();

        // Broadcast the new location (socket event)
        req.app.get('io').emit('driverLocationUpdate', { driverId, currentLocation });

        res.json({ message: "Location updated successfully", driver });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
