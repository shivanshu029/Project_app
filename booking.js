const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
       // correct format for required
    },
    pickupLocation: {
      type: String,
      required: true // correct format for required
    },
    dropoffLocation: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Out for Pickup','Goods Collected','Out for Delivery', 'Delivered'],
      default: 'Pending'
    },
    vehicleType: {
      type: String,
      enum: ['Car', 'Truck', 'Van'],
      default: 'Car'
    },
    price: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  

module.exports = mongoose.model("Booking", bookingSchema);
