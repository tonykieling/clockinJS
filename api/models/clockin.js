// this is the definition/shape of products should like in the application
const mongoose = require("mongoose");

const clockinSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  date: {
    type: Date,
    required: true
  },
  time_start: {
    type: Date,
    required: true
  },
  time_end: {
    type: Date,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  },
  invoice_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    required: true
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Clockin", clockinSchema);
