import React, { useState } from 'react';
import './index.css';

function App() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setMessage('Thank you for signing up!');
      setEmail(''); // Clear the input field
    } else {
      setMessage('Please enter a valid email address.');
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
        <p>Your personal assistant for video game analytics, recommendations, and more.</p>
        <form className="email-signup" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        {message && <div className="feedback">{message}</div>}
      </div>
    </div>
  );
}

export default App;

