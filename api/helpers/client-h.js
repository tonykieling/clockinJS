/**
 * this file checks client information, collect and return them
 */

const Client  = require("../models/client.js");

const check = async(id, userId) => {
// console.log("inside CLIENTTT CHECK");
  try {
    const checkClient = await Client
      .findOne({ _id: id });

    if (!checkClient)
      return ({
        result  : false,
        message : `Error CH01: Client does not exist`
      });

    // check whether the Client belongs to the User
    if (checkClient.user_id != userId)
      return ({
        result: false,
        text  : `Error CH02: Current Client does not belong to your User.`
      });

    return ({
      result: true,
      checkClient
    });
    
  } catch(err) {
    console.trace("Error: ", err.message);
    return ({
      result  : false,
      message : `Error CH03: Something got wrong`
    });
  }
}


module.exports = {
  check
};