const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Middleware to authenticate JWT
function authenticateJWT(req, res, next) {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(403).send('Access denied');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }

    req.user = user;
    next();
  });
}

module.exports = { authenticateJWT };
