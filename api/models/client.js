// this is the definition/shape of products should like in the application
const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  
  name: {
    type: String,
    required: true
  },

  nickname: {
    type: String
    // required: true
  
  },
  birthday: {
    type: Date
    // type: String
  },
  
  mother: {
    type: String
    // required: true
  },
  
  mphone: {
    type: String
    // required: true
  },
  
  memail: {
    type: String
    // match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  
  father: {
    type: String
    // default: `Client's-father`
  },
  
  fphone: {
    type: String
  },
  
  femail: {
    type: String
    // match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },

  consultant: {
    type: String
    // required: true
  },
  
  cphone: {
    type: String
    // required: true
  },
  
  cemail: {
    type: String
    // required: true,
    // match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  
  default_rate: {
    // type: Number
    type: String
    // required: true
  },
  
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  deleted: {
    type: Boolean
  },
  
  invoice_sample: {
    type: String
  },

  type_kid: {
    type: Boolean
  },


  
  email: {
    type: String
  },

  address: {
    type: String
  },

  city: {
    type: String
  },

  province: {
    type: String
  },

  postal_code: {
    type: String
  },

  phone: {
    type: String
  },

  type_of_service: {
    type: String
  }
  
});

module.exports = mongoose.model("Client", clientSchema);
