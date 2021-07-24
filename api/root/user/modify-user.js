const User = require("../../models/user.js");
const tokenCreation = require("../../helpers/token.js").token_creation;

module.exports = async(req, res) => {
  // console.log("     inside modify-user.js");
  const { name,
          email,
          admin,
          address,
          city,
          postalCode,
          phone } = req.body;

  if (!email) {
    return res.status(200).json({
      error: `EMU03: Email is mandatory.`
    });
  }
   
  const { 
          query: { userId } 
        } = req;
        
  try {
    const checkUser = await User
      .findById(userId);

    if (!checkUser)
      return res.status(200).json({
        error: `EMU02: User's <${userId}> NOT found.`
      });
    
    const changeUser = await User
      .updateOne({
        _id: checkUser._id
      }, {
        $set: {
          email,
          name,
          admin,
          address,
          city,
          postal_code: postalCode,
          phone
        }
      }, {
        runValidators: true
      });
    
    if (changeUser.nModified) {
      const modifiedUser = await User
        .findById({ _id: userId})
        .select(" name email admin");

      const token = await tokenCreation(modifiedUser.email, modifiedUser._id, modifiedUser.name, modifiedUser.admin);

      const returnUser = {
        name, email, city, address, postalCode, phone, token
      }
      
      return res.json({
        message : `User <${modifiedUser.email}> has been modified.`,
        newData    : returnUser
      });

    } else
      return res.status(200).json({
        message: `User <${email}> not changed- no new data`
      });

  } catch(err) {
    console.trace("Error: ", err.message);
    return res.status(200).json({
      error: "EMU05: Something bad happened. Try again."
    });
  }
};