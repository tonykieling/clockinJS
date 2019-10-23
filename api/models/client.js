// this is the definition/shape of products should like in the application
const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  birthday: {
    type: String
  },
  mother: {
    type: String,
    required: true
  },
  mphone: {
    type: String,
    required: true
  },
  memail: {
    type: String
  },
  father: {
    type: String,
    default: `Client's-father`
  },
  fphone: {
    type: String
  },
  femail: {
    type: String
  },
  consultant: {
    type: String,
    required: true
  },
  cphone: {
    type: String,
    required: true
  },
  cemail: {
    type: String,
    required: true
  },
  default_rate: {
    type: Number,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Client", clientSchema);
