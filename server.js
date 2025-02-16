const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { authenticateJWT } = require('./auth');

dotenv.config();

const app = express();
app.use(express.json()); // for parsing JSON payloads

const users = []; // In-memory user storage for simplicity

// Register a user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { username, password: hashedPassword };
  users.push(user);

  res.status(201).send('User registered');
});

// Login route to authenticate the user and return a JWT
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  const user = users.find(u => u.username === username);
  
  if (!user) {
    return res.status(401).send('Invalid credentials');
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).send('Invalid credentials');
  }

  // Generate a JWT token
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
  res.json({ token });
});

// Protected route
app.get('/protected', authenticateJWT, (req, res) => {
  res.send('This is a protected route, your JWT is valid!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
