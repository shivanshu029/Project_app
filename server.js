const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');

// Import routes
const userRoutes = require('./routes/user');
const driverRoutes = require('./routes/driver');
const bookingRoutes = require('./routes/booking');
const adminRoutes=require('./routes/admin')

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);


app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});


const PORT = process.env.PORT || 8080; // Change this if needed
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
