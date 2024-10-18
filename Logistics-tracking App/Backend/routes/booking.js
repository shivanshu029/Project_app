const express = require('express');
const Booking = require('../models/booking');
const Driver = require('../models/driver');
const  router = express.Router();
const jwt = require('jsonwebtoken');

const rates = {
    Car: 0.12,    // usd per km
    Van: 0.18,    // usd per km
    Truck: 0.24   // usd per km
};


// Function to get distance between pickup and drop-off locations
const getDistanceInKm = (pickupLocation, dropoffLocation) => {
    const distanceMatrix = {
        "New York City - JFK Airport": {
            "New York City - Times Square": 25,
            "San Francisco - Union Square": 4100,
            "San Francisco - SFO Airport": 4100,
            "Los Angeles - LAX Airport": 4500,
            "Los Angeles - Downtown": 4500,
            "Chicago - O'Hare Airport": 1200,
            "Chicago - Millennium Park": 1200,
            "Boston - Logan Airport": 350,
            "Boston - Harvard Square": 350
        },
        "New York City - Times Square": {
            "New York City - JFK Airport": 25,
            "San Francisco - Union Square": 4080,
            "San Francisco - SFO Airport": 4080,
            "Los Angeles - LAX Airport": 4480,
            "Los Angeles - Downtown": 4480,
            "Chicago - O'Hare Airport": 1190,
            "Chicago - Millennium Park": 1190,
            "Boston - Logan Airport": 330,
            "Boston - Harvard Square": 330
        },
        "San Francisco - Union Square": {
            "New York City - JFK Airport": 4100,
            "New York City - Times Square": 4080,
            "San Francisco - SFO Airport": 25,
            "Los Angeles - LAX Airport": 600,
            "Los Angeles - Downtown": 600,
            "Chicago - O'Hare Airport": 2900,
            "Chicago - Millennium Park": 2900,
            "Boston - Logan Airport": 4200,
            "Boston - Harvard Square": 4200
        },
        "San Francisco - SFO Airport": {
            "New York City - JFK Airport": 4100,
            "New York City - Times Square": 4080,
            "San Francisco - Union Square": 25,
            "Los Angeles - LAX Airport": 600,
            "Los Angeles - Downtown": 600,
            "Chicago - O'Hare Airport": 2900,
            "Chicago - Millennium Park": 2900,
            "Boston - Logan Airport": 4200,
            "Boston - Harvard Square": 4200
        },
        "Los Angeles - LAX Airport": {
            "New York City - JFK Airport": 4500,
            "New York City - Times Square": 4480,
            "San Francisco - Union Square": 600,
            "San Francisco - SFO Airport": 600,
            "Los Angeles - Downtown": 30,
            "Chicago - O'Hare Airport": 3200,
            "Chicago - Millennium Park": 3200,
            "Boston - Logan Airport": 4000,
            "Boston - Harvard Square": 4000
        },
        "Los Angeles - Downtown": {
            "New York City - JFK Airport": 4500,
            "New York City - Times Square": 4480,
            "San Francisco - Union Square": 600,
            "San Francisco - SFO Airport": 600,
            "Los Angeles - LAX Airport": 30,
            "Chicago - O'Hare Airport": 3200,
            "Chicago - Millennium Park": 3200,
            "Boston - Logan Airport": 4000,
            "Boston - Harvard Square": 4000
        },
        "Chicago - O'Hare Airport": {
            "New York City - JFK Airport": 1200,
            "New York City - Times Square": 1190,
            "San Francisco - Union Square": 2900,
            "San Francisco - SFO Airport": 2900,
            "Los Angeles - LAX Airport": 3200,
            "Los Angeles - Downtown": 3200,
            "Chicago - Millennium Park": 15,
            "Boston - Logan Airport": 1300,
            "Boston - Harvard Square": 1300
        },
        "Chicago - Millennium Park": {
            "New York City - JFK Airport": 1200,
            "New York City - Times Square": 1190,
            "San Francisco - Union Square": 2900,
            "San Francisco - SFO Airport": 2900,
            "Los Angeles - LAX Airport": 3200,
            "Los Angeles - Downtown": 3200,
            "Chicago - O'Hare Airport": 15,
            "Boston - Logan Airport": 1300,
            "Boston - Harvard Square": 1300
        },
        "Boston - Logan Airport": {
            "New York City - JFK Airport": 350,
            "New York City - Times Square": 330,
            "San Francisco - Union Square": 4200,
            "San Francisco - SFO Airport": 4200,
            "Los Angeles - LAX Airport": 4000,
            "Los Angeles - Downtown": 4000,
            "Chicago - O'Hare Airport": 1300,
            "Chicago - Millennium Park": 1300,
            "Boston - Harvard Square": 20
        },
        "Boston - Harvard Square": {
            "New York City - JFK Airport": 350,
            "New York City - Times Square": 330,
            "San Francisco - Union Square": 4200,
            "San Francisco - SFO Airport": 4200,
            "Los Angeles - LAX Airport": 4000,
            "Los Angeles - Downtown": 4000,
            "Chicago - O'Hare Airport": 1300,
            "Chicago - Millennium Park": 1300,
            "Boston - Logan Airport": 20
        }
    };
    

    // Check if there's a predefined distance between the two locations
    if (
        distanceMatrix[pickupLocation] &&
        distanceMatrix[pickupLocation][dropoffLocation]
    ) {
        return distanceMatrix[pickupLocation][dropoffLocation];
    } else {
        return 0; // If no predefined distance, return 0 or handle as needed
    }
};


// POST API to estimate trip cost
router.post('/price-estimate', async(req, res) => {
    const { pickupLocation, dropoffLocation, vehicleType } = req.body;

    // Check if all required fields are provided
    if (!pickupLocation || !dropoffLocation || !vehicleType) {
        return res.status(400).json({ error: "All fields (pickupLocation, dropOffLocation, vehicleType) are required" });
    }

    // Get the hardcoded distance between the locations
    const distance = getDistanceInKm(pickupLocation, dropoffLocation);
//const distance = 100;


    // Check if distance was found
    if (distance === 0) {
        return res.status(400).json({ error: "Invalid locations or distance not available" });
    }

    // Calculate price based on vehicle type and distance
    const ratePerKm = rates[vehicleType];
    if (!ratePerKm) {
        return res.status(400).json({ error: "Invalid vehicle type" });
    }

    const price = distance * ratePerKm;

    return res.json({ price, distance, vehicleType });
});



// Create a new booking


// In your booking route
router.post('/book', (req, res) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];


  try {
    const decodedToken = jwt.decode(token);
    console.log(decodedToken);
   
    const userId = decodedToken.id; // Extract userId from the decoded token

    const { pickupLocation, dropoffLocation, vehicleType, price } = req.body;

    if (!pickupLocation || !dropoffLocation || !vehicleType || !price) {
        return res.status(400).json({ message: "Missing required fields" });
      }

    const booking = new Booking({
      userId,
      pickupLocation,
      dropoffLocation,
      vehicleType,
      price,
    });

    booking.save()
      .then(savedBooking => res.json(savedBooking))
      .catch(err => res.status(500).json({ message: 'Error creating booking' }));
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
});

router.get('/all', (req, res) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
      const decodedToken = jwt.decode(token);  // Decode the token
      const userId = decodedToken.id;  // Extract the userId from token
  
      Booking.find({ userId })  // Find all bookings for this user
      .sort({ createdAt: -1 })  // Sort bookings by createdAt in descending order
      .then(bookings => {
        if (!bookings.length) {
          return res.status(404).json({ message: 'No bookings found for this user' });
        }
        res.json(bookings);
      })
        .catch(err => res.status(500).json({ message: 'Error retrieving bookings' }));
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  });

// Mock database entries for demonstration (You can replace these with your DB queries)
// const activeBookings = [
//     {
//         userId: 1,
//         bookingId: 101,
//         pickupLocation: '123 Main St',
//         dropoffLocation: '456 Park Ave',
//         vehicleType: 'Car',
//         driverId: 201,
//         driverLocation: '789 Elm St',
//         status: 'active'
//     }
// ];

// GET API to fetch active booking details for a specific user
router.get('/api/bookings/active', async (req, res) => {
    const userId = req.query.userId; // Assuming userId is sent as a query param

    // Fetch the active booking for the given user from the mock data (Replace this with DB query)
    const activeBooking = activeBookings.find(
        booking => booking.userId === parseInt(userId) && booking.status === 'active'
    );

    if (!activeBooking) {
        return res.status(404).json({ error: 'No active booking found for the user' });
    }

    // Respond with the active booking details
    return res.json({
        bookingId: activeBooking.bookingId,
        pickupLocation: activeBooking.pickupLocation,
        dropoffLocation: activeBooking.dropoffLocation,
        vehicleType: activeBooking.vehicleType,
        driverLocation: activeBooking.driverLocation
    });
});

module.exports = router;
