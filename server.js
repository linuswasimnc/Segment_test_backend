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

//Endpoint to generate JWT token
app.post('/api/generate-intercom-jwt', (req, res) => {
  try {
    const { userId, email, name } = req.body;

    if (!userId || !email) {
      return res.status(400).json({ error: 'userId and email are required' });
    }

    // Create JWT payload according to Intercom documentation
    const payload = {
      user_id: userId.toString(),
      email: email,
      // Add optional attributes if needed
      ...(name && { name: name })
    };

    // Sign the JWT token with 1 hour expiration
    const token = jwt.sign(payload, INTERCOM_SECRET, { expiresIn: '1h' });

    res.json({ jwt: token });
  } catch (error) {
    console.error('Error generating JWT:', error);
    res.status(500).json({ error: 'Failed to generate JWT token' });
  }
}); 



  } catch (error) {
    console.error('Error generating Intercom hash:', error);
    res.status(500).json({ error: 'Failed to generate user hash' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
