// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Get secret from environment variable (set this in Render)
const INTERCOM_SECRET = process.env.INTERCOM_SECRET;

if (!INTERCOM_SECRET) {
  console.error('ERROR: INTERCOM_SECRET environment variable is not set');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint to generate JWT token
app.post('/api/generate-intercom-jwt', (req, res) => {
  console.log('=== Intercom JWT Endpoint Hit ===');
  console.log('Request body:', req.body);
  
  try {
    const { userId, email, name } = req.body;

    if (!userId || !email) {
      console.log('Missing userId or email');
      return res.status(400).json({ error: 'userId and email are required' });
    }

    // Create JWT payload - ONLY user_id and email
    const payload = {
      user_id: userId.toString(),
      email: email
    };

    console.log('JWT Payload:', payload);

    // Sign the JWT token with 1 hour expiration
    const token = jwt.sign(payload, INTERCOM_SECRET, { 
      expiresIn: '1h',
      algorithm: 'HS256'
    });

    console.log('Generated token (first 30 chars):', token.substring(0, 30) + '...');

    // Send back all the data the client needs
    const responseData = {
      jwtToken: token,
      userId: userId.toString(),
      email: email,
      name: name
    };

    console.log('Sending response');
    
    res.json(responseData);

  } catch (error) {
    console.error('Error generating JWT:', error);
    res.status(500).json({ error: 'Failed to generate JWT token', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
