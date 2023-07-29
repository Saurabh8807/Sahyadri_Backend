const express = require('express');
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const User = require('./db/user');
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


function createConnection() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'hotelreservation'
  });
}

let connection;
connection = createConnection();

app.get('/admin/rooms', (req, res) => {
  // Execute the SQL query using the existing connection
  const query = 'SELECT id,assigned_room_type, occupancy_status FROM hotelReservation';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving data from MySQL table:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

app.get('/admin/rooms/:rowNumber', (req, res) => {
  const rowNumber = parseInt(req.params.rowNumber);

  // Execute the SQL query using the existing connection
  const query = `SELECT * FROM hotelReservation LIMIT ${rowNumber - 1}, 1`;
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving row from MySQL table:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Row not found' });
    } else {
      res.json(results[0]);
    }
  });
});

app.put('/admin/rooms/:roomNumber', (req, res) => {
  const roomNumber = parseInt(req.params.roomNumber);
  const updatedData = req.body;

  // Execute the SQL query using the existing connection
  const query = `UPDATE hotelReservation SET ? WHERE id = ?`;
  connection.query(query, [updatedData, roomNumber], (error, results) => {
    if (error) {
      console.error('Error updating row in MySQL table:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Row not found' });
    } else {
      res.json(updatedData);
    }
  });
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

