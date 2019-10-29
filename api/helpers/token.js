const jwt = require("jsonwebtoken");

// this method creates the token and returns it
const token_creation = (email, userId, name, admin) => {
  try {
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
  } catch(err) {
    // console.trace("Error: ", err.message);   //no console, too big message
    return res.status(403).json({
      error: "ETC01: Token is invalid"
    });
  }
};


// it validates the token and returns the decoded one 
const token_validation = (token) => {
  try {
    const decodedToken  = jwt.verify(token, process.env.JWT_KEY);
    return decodedToken;
  } catch(err) {
    // console.trace("Error: ", err.message);   //no console message
    return res.status(403).json({
      error: "ETV01: Token is invalid"
    });
  }
}


module.exports = {
  token_creation,
  token_validation
};