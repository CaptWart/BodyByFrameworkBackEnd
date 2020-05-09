const jwt = require('jsonwebtoken');
const secret = 'secret';

const auth = function(req, res, next) {
  const cookie = req.headers.cookie;
  const token = cookie.substring(6,cookie.length)
  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        req.email = decoded.email;
        req.id = decoded.id;
        next();
      }
    });
  }
}

module.exports = auth;