// here is the middleware made to check the user's token
// it can be used to protect routes
const jwt = require("jsonwebtoken");

// due to proceed with authorization, the front end should send the token by the headers, following the pattern:
// Authorization: Bear <token>

module.exports = ((req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken  = jwt.verify(token, process.env.JWT_KEY);

    req.userData        = decodedToken;
    next();
  } catch(err) {
    res.status(401).json({
      err: "Auth has failed. Middleware"
    }) ;
  }
});