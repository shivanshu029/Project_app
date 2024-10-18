const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Driver = require('../models/driver');
const User = require('../models/users'); 

// Get all bookings in descending order
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 }); // Replace 'bookingDate' with the correct field
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving bookings" });
    }
});

// Get all drivers in descending order
router.get('/drivers', async (req, res) => {
    try {
        const drivers = await Driver.find()
            .populate('userId') // Automatically populate user details
            .sort({ createdAt: -1 });

        res.status(200).json(drivers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving drivers" });
    }
});

// Get all users in descending order
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }); // Replace 'createdAt' with the correct field
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving users" });
    }
});

module.exports = router;
