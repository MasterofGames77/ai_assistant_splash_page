import React, { useState } from 'react';
import './index.css';

function App() {
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    // Here you would typically send the email and referral code to your backend
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, referralCode }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage('Thank you for signing up! Check your email for your referral link.');
        setEmail('');  // Clear the email input field
        setReferralCode('');  // Clear the referral code input field
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  return (
    <div className="container">
      <div className="content">
        <h1>Welcome to Video Game Wingman</h1>
        <p>Join our waitlist and climb higher by inviting friends!</p>
        <form className="email-signup" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter referral code (optional)"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
        {message && <div className="feedback">{message}</div>}
      </div>
    </div>
  );
}

export default App;