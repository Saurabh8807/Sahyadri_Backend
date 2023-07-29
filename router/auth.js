const express = require('express');
const router = express.Router();
const User = require('../db/user');
const Admin = require('../db/admin');
const tableRequest = require('../db/tableRequest');
const bookings = require('../db/reservations');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');

router.get('/', (req, res) => {
  res.send('Authentication route');
});

router.post('/SignUp', async (req, res) => {
  const { name, phone, email, password ,cpassword} = req.body;

  if (!name || !phone || !email || !password) {
    return res.json({ error: 'Please fill in all the fields' });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, phone, email, password: hashedPassword,cpassword });
    await user.save();

    res.status(201).json({ message: 'User signed up successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

router.post('/SignUpAdmin', async (req, res) => {
  const { key ,name, phone, email, password ,cpassword} = req.body;

  if (!key || !name || !phone || !email || !password || !cpassword) {
    return res.json({ error: 'Please fill in all the fields' });
  }

  try {
    const userExist = await Admin.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = new Admin({ key,name, phone, email, password: hashedPassword,cpassword });
    await admin.save();

    res.status(201).json({ message: 'Admin signed up successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

router.post('/SignIn', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please fill in all the fields' });
    }

    const userLogin = await User.findOne({ email: email });
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid password' });
      }

      // Generate and assign an authentication token
      const token = await userLogin.generateAuthToken();

      res.json({
        message: 'User sign-in successful',
        name: userLogin.name,
        token: token,
      });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

router.post('/SignInAdmin', async (req, res) => {
  try {
    const { key,email, password } = req.body;
    const compareStrings = (text1, text2) => {
      return text1 === text2;
    };
    if (!email || !password || !key) {
      return res.status(400).json({ error: 'Please fill in all the fields' });
    }

    const adminLogin = await Admin.findOne({ email: email });
    if (adminLogin) {
      const isMatch = await bcrypt.compare(password, adminLogin.password);
      const isKey = compareStrings(key,adminLogin.key );
      if (!isKey) {
        return res.status(400).json({ error: 'Invalid keys' });
      }

      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid password' });
      }

      // Generate and assign an authentication token
      const token = await adminLogin.generateAuthToken();

      res.json({
        message: 'Admin sign-in successful',
        name: adminLogin.name,
        token: token,
      });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});
// API endpoint for saving form data
router.post("/user/tableRequest", (req, res) => {
  // Extract the form data from the request body
  const { name, roomNumber, phoneNumber, guests, time, items } = req.body;

  // Create a new instance of the FormData model
  const formData = new tableRequest({
    name,
    roomNumber,
    phoneNumber,
    guests,
    time,
    items,
  });

  // Save the form data to the database
  formData
    .save()
    .then(() => {
      res.json({ message: "Form data saved successfully" });
    })
    .catch((error) => {
      console.error("Error saving form data:", error);
      res.status(500).json({ error: "Failed to save form data" });
    });
});

router.post("/user/bookings", (req, res) => {
  // Extract the form data from the request body
  const { name, email, phone, address, date1, date2, adults, childrens,rooms,roomType } = req.body;

  // Create a new instance of the FormData model
  const formData = new bookings({
    name,
    email,
    phone,
    address,
    date1,
    date2,
    adults,
    childrens,
    rooms,
    roomType,
  });

  // Save the form data to the database
  formData
    .save()
    .then(() => {
      res.json({ message: "Form data saved successfully" });
    })
    .catch((error) => {
      console.error("Error saving form data:", error);
      res.status(500).json({ error: "Failed to save form data" });
    });
});


router.get('/user/home', authenticate, (req, res) => {
  res.send(req.rootUser);
});
router.get('/user/about', authenticate, (req, res) => {
  res.send(req.rootUser);
});
router.get('/user/reservation', authenticate, (req, res) => {
  res.send(req.rootUser);
});
router.get('/user/photos', authenticate, (req, res) => {
  res.send(req.rootUser);
});
router.get('/user/restaurant', authenticate, (req, res) => {
  res.send(req.rootUser);
});
router.get('/user/contact', authenticate, (req, res) => {
  res.send(req.rootUser);
});

module.exports = router;
