const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next) {
  const token = req.cookies.authToken;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const userPayload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = userPayload;
    return next();
  } catch (error) {
    return res.sendStatus(401);
  }
}

module.exports = auth;

// https://medium.com/swlh/nodejs-with-jwt-authentication-feb961763541
// https://www.section.io/engineering-education/how-to-build-authentication-api-with-jwt-token-in-nodejs/
// https://medium.com/swlh/nodejs-with-jwt-authentication-feb961763541
