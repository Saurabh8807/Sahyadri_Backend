const express = require('express');
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const User = require('./db/user');
const rooms = require('./db/rooms');

const { Transform } = require('stream');
const mysql = require('mysql2');

const TableRequest = require('./db/tableRequest');
const Booking = require('./db/reservations');
const cors = require('cors');
require('./db/config');

// const User = require('./db/reservations');
const CardDetails = require('./db/cardDetails');
const app = express();
dotenv.config({path:'./.env'})
const PORT = process.env.PORT ;

// Middleware
const middleware = (req, res, next) => {
  console.log("hello my middleware");
  next();
};

app.use(express.json());
app.use(cors());

// Mount the router
const authRouter = require('./router/auth');
const tableRequest = require('./db/tableRequest');
app.use('/', authRouter);

app.get(('/'),(req,res)=>{
  res.send("h")
})

// Example route to get all reservations
app.get('/admin/rooms', async (req, res) => {
  try {
    const allRooms = await rooms.find();
    res.json(allRooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// ... other routes

//xample route to get a reservation by ID
// Example route to get a room by ID
// Example route to get a room by "No."
app.get('/admin/rooms/:roomNo', async (req, res) => {
  try {
    const { roomNo } = req.params;

    // Convert roomNo to a number
    const roomNumber = parseInt(roomNo);
    const room = await rooms.findOne({ "No": roomNumber }); // Use your rooms model
    
    if (!room) {
      console.log(roomNumber)
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    res.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


// Example route to update a room by "No."
app.put('/admin/rooms/:roomNo', async (req, res) => {
  try {
    const { roomNo } = req.params;

    // Convert roomNo to a number
    const roomNumber = parseInt(roomNo);

    // Find the room by "No." and update it
    const updatedRoom = await rooms.findOneAndUpdate(
      { "No": roomNumber },
      req.body, // Use the request body to update the room
      { new: true } // This option returns the updated document
    );

    if (!updatedRoom) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    res.json(updatedRoom);
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/admin/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// API endpoint to delete a user
app.delete('/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, error: 'An error occurred' });
  }
});

app.get('/user/tableRequest', async (req, res) => {
  try {
    const tableRequest = await TableRequest.find();
    res.json(tableRequest);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/user/bookings', async (req, res) => {
  try {
    const booking = await Booking.find();
    res.json(booking);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.delete('/user/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, error: 'An error occurred' });
  }
});


app.delete('/user/tableRequest/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await TableRequest.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, error: 'An error occurred' });
  }
});
app.post('/Payment', async (req, res) => {
  let cardDetails = new CardDetails(req.body);
  let result = await cardDetails.save();
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

