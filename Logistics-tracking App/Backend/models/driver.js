const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleType: { type: String, required: true },
    currentLocation: {
        type: String,
        enum: [
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
        ], // Updated list of locations
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model('Driver', driverSchema);
