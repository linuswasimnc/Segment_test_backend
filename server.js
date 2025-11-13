const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const INTERCOM_SECRET = process.env.INTERCOM_SECRET;

if (!INTERCOM_SECRET) {
  console.error('ERROR: INTERCOM_SECRET environment variable is not set');
  process.exit(1);
}

// UPDATED CORS CONFIGURATION
app.use(cors({
  origin: [
    'https://linuswasimnc.github.io/Segment_test/',  // Replace with your actual GitHub Pages URL
    'http://localhost:3000',  // For local testing
    'http://127.0.0.1:3000'   // For local testing
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

app.post('/api/generate-intercom-jwt', (req, res) => {
  try {
    const { userId, email, name } = req.body;

    if (!userId || !email) {
      return res.status(400).json({ error: 'userId and email are required' });
    }

    const payload = {
      user_id: userId,
      email: email,
      ...(name && { name: name })
    };

    const token = jwt.sign(payload, INTERCOM_SECRET, { expiresIn: '1h' });

    res.json({ jwt: token });
  } catch (error) {
    console.error('Error generating JWT:', error);
    res.status(500).json({ error: 'Failed to generate JWT token' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    routes: [
      'GET /health',
      'GET /test', 
      'POST /api/generate-intercom-jwt'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
