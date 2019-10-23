const jwt = require("jsonwebtoken");

// this method creates  the token and returns it
token = (email, userId, name, admin) => {
  return jwt.sign({
    email,
    userId,
    name,
    admin
  },
  process.env.JWT_KEY,
  {
    expiresIn: process.env.JWT_expiration,
  })
};

module.exports = {
  token
};