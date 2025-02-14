const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Simulated Database (usually you'd have an actual database)
const users = [
  {
    id: 1,
    username: 'user1',
    password: 'password1',
  }
];

// Secret key for signing JWT
const SECRET_KEY = 'your-secret-key';

// Login Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).send('User not found');
  }

  // Verify password
  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (err) throw err;

    if (isMatch) {
      // Create a JWT token
      const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

      return res.json({ token });
    } else {
      return res.status(401).send('Invalid password');
    }
  });
});

// Protected Route
app.get('/profile', (req, res) => {
  // Get the token from the Authorization header
  const token = req.headers['authorization']?.split(' ')[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(403).send('No token provided');
  }

  // Verify the token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }

    // Access granted to protected route
    res.json({ message: 'Welcome to your profile', user: decoded });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
