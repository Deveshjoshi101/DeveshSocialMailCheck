const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require("./connect");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store generated OTPs temporarily
const otpStorage = {};

// Create users table if it doesn't exist
db.query(`CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
)`, (err, result) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table created successfully');
  }
});

// Endpoint to request OTP
app.post('/request-otp', (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  console.log('OTP generated:', otp);

  console.log('Requesting OTP for email:', email);

  // Store OTP temporarily in memory
  otpStorage[email] = otp;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptionsForOTP = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Registration',
    text: `Your OTP for registration is: ${otp}`,
  };

  transporter.sendMail(mailOptionsForOTP, (error, info) => {
    if (error) {
      console.error('Error sending OTP:', error);
      return res.status(500).json({ error: error.toString() });
    }
    console.log('OTP sent successfully:', info.response);
    res.status(200).json({ message: 'OTP sent successfully' });
  });
});

// Endpoint for user registration
app.post('/register', (req, res) => {
  const { username, name, email, password, otp } = req.body;

  // Retrieve OTP from temporary storage
  const storedOTP = otpStorage[email];

  // Verify OTP
  if (!storedOTP || storedOTP !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptionsToRecipient = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Registration Successful',
    text: 'You have registered your email with SocialDev Successfully.',
  };

  const mailOptionsToDevesh = {
    from: process.env.EMAIL_USER,
    to: 'deveshjoshi101@gmail.com',
    subject: 'New Registration',
    text: `${email} has registered.`,
  };

  // Send email to recipient
  transporter.sendMail(mailOptionsToRecipient, (error, info) => {
    if (error) {
      console.error('Error sending email to recipient:', error);
      return res.status(500).json({ error: error.toString() });
    }
    console.log('Email sent to recipient:', info.response);

    // Send email to Devesh
    transporter.sendMail(mailOptionsToDevesh, (error, info) => {
      if (error) {
        console.error('Error sending email to Devesh:', error);
        return res.status(500).json({ error: error.toString() });
      }
      console.log('Email sent to Devesh:', info.response); // Log the response for Devesh
      res.status(200).json({ message: 'Emails sent successfully' });
    });
  });
  // Insert user details into the database
  const sql = 'INSERT INTO users (username, name, email, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [username, name, email, password], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ error: 'Error registering user' });
    }
    console.log('User registered successfully');
    res.status(200).json({ message: 'Registration successful' });
  });
});

// Check if user exists
app.post('/check-user', (req, res) => {
  const { username, name, email, password } = req.body;

  // Check if username, name, email, or password exists in the database
  const sql = 'SELECT * FROM users WHERE username = ? OR name = ? OR email = ? OR password = ?';
  db.query(sql, [username, name, email, password], (err, result) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).json({ error: 'Error checking user' });
    }
    if (result.length > 0) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
