const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const apiResponse = require('../helpers/apiResponse');

const authenticate = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return apiResponse.unauthorizedResponse(res, 'Authentication failed');
      } else {
        req.user = user
        next();
      }
    });
  } else {
    return apiResponse.unauthorizedResponse(res, 'Authentication failed');
  }
}

module.exports = authenticate;
