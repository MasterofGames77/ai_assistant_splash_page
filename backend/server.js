const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// API route for user registration
app.post('/api/register', (req, res) => {
  const { email, referralCode } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  // Dummy user data storage (in-memory)
  const users = [];

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

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

  res.json({ success: true, message: 'Registration successful', data: newUser });
});

// Catch-all handler to send back React's index.html for any request that doesn't match an API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});