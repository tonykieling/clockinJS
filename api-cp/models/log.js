// this is the definition/shape of products should like in the application
const mongoose = require("mongoose");

const logSchema = mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  
  id: {
    type: String
  },

  date: {
    type: Date
  }
  
});

module.exports = mongoose.model("Log", logSchema);
