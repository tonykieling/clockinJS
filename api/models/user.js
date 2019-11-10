// this is the definition/shape of products should like in the application
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId
  },

  admin: {
    type: Boolean,
    default: false
  },

  name: {
    type: String
  },
  
  email: { 
    type: String, 
    required: true,
    createIndexes: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  
  password: { 
    type: String, 
    required: true
  },
  
  deleted: {
    type: Boolean
  },

  address: {
    type: String,
    // required: true
  },
  city: {
    type: String,
    // required: true
  },
  postal_code: {
    type: String,
    // required: true
  },
  phone: {
    type: String,
    // required: true
  },      

  
});

module.exports = mongoose.model("User", userSchema);
