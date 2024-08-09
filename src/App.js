import React, { useState } from 'react';
import './index.css';
import logo from './assets/video-game-wingman-logo.png'; // Ensure the correct path to your logo

function App() {
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show the spinner

    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      setLoading(false); // Hide the spinner
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, referralCode }),
      });

      const result = await response.json();
      setLoading(false); // Hide the spinner after the request completes
      if (result.success) {
        setMessage('Thank you for signing up! Check your email for your referral link.');
        setEmail('');  // Clear the email input field
        setReferralCode('');  // Clear the referral code input field
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      setLoading(false); // Hide the spinner in case of an error
    }
  };

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  return (
    <div className="container">
      <div className="hero">
        <img src={logo} alt="Video Game Wingman Logo" className="logo" />
        {/* <h1>Video Game Wingman</h1> */}
        <h2>Join the waitlist and elevate your gameplay!</h2>
      </div>
      
      {/* Rest of your content goes here */}
      <h2>What is Video Game Wingman?</h2>
      <p className="description">
        Video Game Wingman empowers gamers with an unfair advantage through strategic insights and personalized analytics to elevate their gameplay and performance.
      </p>
  
      <h2>What Can Video Game Wingman Do?</h2>
      <ul className="features">
        <li>Provide personalized game recommendations based on your preferences and play history.</li>
        <li>Analyze your gameplay data to offer insights and strategies for improvement.</li>
        <li>Retrieve detailed game information, including release dates, genres, and platforms.</li>
        <li>Integrate data from sources like IGDB, RAWG, and Twitch to keep you updated on the latest trends.</li>
        <li>Assist in discovering new games, tracking upcoming releases, and finding the best deals.</li>
      </ul>
  
      <form className="email-signup" id="email-signup-form" method="post" onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email" 
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
  
        <input 
          type="text" 
          name="referralCode" 
          placeholder="Enter referral code (optional)"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)} 
        />
  
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Sign Up'}
        </button>
      </form>
      {loading && <div className="spinner"></div>}
      {message && <div className="feedback">{message}</div>}
    </div>
  );
}

export default App;