/**
 * this file checks user information, collect and return them
 */

const User      = require("../models/user.js");

const check = async(id) => {
// console.log("inside USER CHECK");
  try {
    const checkUser = await User
      .findOne({ _id: id });
    if (!checkUser)
      return ({
        result  : false,
        message : `Error UH01: User <${id}> does not exist`
      });
    return ({
      result: true,
      checkUser
    });
  } catch(err) {
    console.trace("Error: ", err.message);
    return ({
      result  : false,
      message : `Error UH02: Something got wrong`
    });
  }
}


module.exports = {
  check
};