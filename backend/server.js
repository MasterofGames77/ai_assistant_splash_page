const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Dummy user data storage (in-memory)
const users = []; // Array to store user data

// API route for user registration
app.post('/api/register', (req, res) => {
  const { email, referralCode } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already registered. Would you like to resend the referral link?' });
  }

  // Configure the SMTP transporter using Outlook settings
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER, // Your Outlook email address
      pass: process.env.EMAIL_PASS, // Your Outlook app-specific password
    },
    connectionTimeout: 10000, // Set connection timeout to 10 seconds
  });

  // Generate a unique referral link (in a real application, this would be a URL with a unique token)
  const referralLink = `http://localhost:5000/?ref=${encodeURIComponent(email)}`;

  // Add new user
  const newUser = {
    email,
    referralCode,
    referrals: 0,
    position: users.length + 1, // Simple waitlist position
  };
  users.push(newUser);

  // Handle referral if a valid referral code was provided
  if (referralCode) {
    const referrer = users.find(user => user.email === referralCode);
    if (referrer) {
      referrer.referrals += 1;
    }
  }

  // Send the referral email using your Outlook account
  const mailOptions = {
    from: process.env.EMAIL_USER, // Your Outlook email
    to: email, // The user's email
    subject: 'Your Referral Link for Video Game Wingman',
    text: `Thank you for signing up! Share this link with your friends to climb the waitlist: ${referralLink}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ success: false, message: 'Failed to send referral email.' });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ success: true, message: 'Registration successful. Check your email for your referral link!', data: newUser });
    }
  });
});

// API route to resend referral link for already registered users
app.post('/api/resend', (req, res) => {
  const { email } = req.body;

  // Check if the user is already registered
  const existingUser = users.find(user => user.email === email);
  if (!existingUser) {
    return res.status(400).json({ success: false, message: 'Email not registered' });
  }

  // Generate the referral link
  const referralLink = `http://localhost:5000/?ref=${encodeURIComponent(email)}`;

  // Send the referral email using your Outlook account
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER, // Your Outlook email
      pass: process.env.EMAIL_PASS, // Your Outlook app-specific password
    },
    connectionTimeout: 10000, // Set connection timeout to 10 seconds
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Referral Link for Video Game Wingman (Resend)',
    text: `Here is your referral link again! Share this link with your friends to climb the waitlist: ${referralLink}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ success: false, message: 'Failed to resend referral email.' });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ success: true, message: 'Referral link resent successfully. Check your email!', data: existingUser });
    }
  });
});

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, '../build')));

// Catch-all handler to send back React's index.html for any request that doesn't match an API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});