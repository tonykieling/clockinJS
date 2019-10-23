// this is the definition/shape of products should like in the application
const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String
  },
  email: { 
    type: String, 
    required: true,
    createIndexes: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
  password: { 
    type: String, 
    required: true }
});

module.exports = mongoose.model("Client", clientSchema);
