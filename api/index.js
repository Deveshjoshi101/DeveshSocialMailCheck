const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const db = require("./connect");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Store generated OTPs temporarily
const otpStorage = {};

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Endpoint to request OTP
app.post('/request-otp', (req, res) => {
  const { email } = req.body;
  const otp = generateOTP().toString();
  console.log('OTP generated:', otp);
  otpStorage[email] = otp;
  console.log("otpStorage[email]",otpStorage[email]);

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

// Endpoint to request mail
app.post('/send-email', (req, res) => {
  const { email, otp } = req.body;

  console.log("otpStorage[email] (value, type):", otpStorage[email], typeof otpStorage[email]);
  console.log("otp (value, type):", otp, typeof otp);

  console.log("!otpStorage[email]",!otpStorage[email], "otpStorage[email] !== otp", otpStorage[email] !== otp, "otp", otp);

  if (!otpStorage[email] || otpStorage[email] !== otp) {
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
    text: 'You have registered your email with SocialDev.',
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
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
