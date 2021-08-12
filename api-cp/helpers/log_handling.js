const Log    = require("../models/log.js");

const add_log = async (id) => {
  try {
    const newLog = new Log({
      id,
      date: new Date()
    });
  
    await newLog.save();
  } catch (err) {
    console.log("ERROR: Error on saving log!!!");
  }

  return;
}


module.exports = add_log;